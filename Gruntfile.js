module.exports = function(grunt) {
  'use strict';

  require('./lib/javascript.extensions.js');
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');

  var $q = require('q');
  var request = require('request');
  var fs = require('fs');
  var semver = require('semver');
  var sh = require('shelljs');

  /* CONSTANTS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  var LICENSE_TEXT = [
      '/*',
      ' * Soyto.github.io (<%= pkg.version %>)',
      ' * \t\t\t\tDO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE',
      ' * \t\t\t\t\tVersion 2, December 2004',
      ' * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>',
      ' * Everyone is permitted to copy and distribute verbatim or modified',
      ' * copies of this license document, and changing it is allowed as long',
      ' * as the name is changed.',
      ' * ',
      ' * \t\t\t\tDO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE',
      ' * \t\tTERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION',
      ' * ',
      ' * 0. You just DO WHAT THE FUCK YOU WANT TO.',
      ' */'
    ].join('\n') + '\n';

  var SERVERS_LIST = [
    {id : 47, name: 'Alquima'},
    {id : 46, name: 'Anuhart'},
    {id : 39, name: 'Balder'},
    {id : 49, name: 'Barus'},
    {id : 45, name: 'Calindi'},
    {id : 48, name: 'Curatus'},
    {id : 36, name: 'Kromede'},
    {id : 44, name: 'Nexus'},
    {id : 34, name: 'Perento'},
    {id : 31, name: 'Spatalos'},
    {id : 42, name: 'Suthran'},
    {id : 32, name: 'Telemachus'},
    {id : 37, name: 'Thor'},
    {id : 40, name: 'Urtem'},
    {id : 43, name: 'Vehalla'},
    {id : 51, name: 'Zubaba'},
  ];

  //Your website login and password
  var USER_LOGIN = '**********';
  var USER_PASSWORD = '************';

  var USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36';
  var BASE_FOLDER = 'data/';

  //Application files
  var APP_FILES = [
    'app/app.js',

    'app/controllers/index.controller.js',
    'app/controllers/ranking.list.controller.js',
    'app/controllers/root.controller.js',

    'app/services/helper.service.js',
    'app/services/storedData.service.js'
  ];

  var CONCAT_DEST = 'dst/app.js';
  var UGLIFY_DEST = 'dst/app.min.js';

  /* GRUNT CONFIG
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  var gruntConfig = {};

  //PACKAGE
  gruntConfig.pkg = grunt.file.readJSON('package.json');

  //JSHINT
  gruntConfig.jshint = {
    options : {jshintrc: '.jshintrc'},
    files: APP_FILES
  };

  //CONCAT
  gruntConfig.concat  = {
    options: { banner: LICENSE_TEXT },
    app: {
      options: {separator: '\n\n' },
      src: APP_FILES,
      dest: CONCAT_DEST,
      nonull: true
    }
  };

  //UGLIFY
  gruntConfig.uglify = {
    options: { banner: LICENSE_TEXT },
    app: {
      src: [CONCAT_DEST],
      dest: UGLIFY_DEST,
    }
  };

  //SHELL
  gruntConfig.shell = {

  };


  grunt.initConfig(gruntConfig);


  /* GRUNT TASKS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Default task, just jshint , concat and iglify for the moment
  grunt.registerTask('default', function(){
    grunt.task.run('compile');
  });

  grunt.registerTask('compile', function(){
    grunt.task.run('jshint');
    grunt.task.run('concat:app');
    grunt.task.run('uglify:app');
  });

  //Runs crawler for just one server, ex. grunt one-server-crawler:Alquima
  grunt.registerTask('one-server-crawler', function(){
    var done = this.async();

    var serverName = this.args[0];
    var server = SERVERS_LIST.first(function(server){ return server.name.toLowerCase() == serverName.toLowerCase(); });

    //NO server nothing to do
    if(!server) {
      done();
      return;
    }

    login(USER_LOGIN, USER_PASSWORD).then(function(cookie){
      retrieveServer(server.name, server.id, cookie)
        .then(function(data) {

          console.log('Retrieved [%s]', data.serverName);
          grunt.file.write(folderName + data.serverName + '.json', JSON.stringify(data.entries));

        }).catch(function(err){
          console.log(err);
        }).finally(function(){
          done();
        });
    });
  });

  //Crawler task, will gather data from Gameforge server
  grunt.registerTask('crawler',function() {
    var done = this.async();

    var folderName = BASE_FOLDER + today() + '/';
    var endFileName = BASE_FOLDER + today() + '.json';

    if(grunt.file.exists(folderName)) {
      console.log('folder already exists');
      return;
    }

    grunt.file.mkdir(folderName);

    var fullServersIfo = {};


    login(USER_LOGIN, USER_PASSWORD).then(function (cookie) {

      var onDataExtracted = function (data) {

        fullServersIfo[data.serverName] = {};
        fullServersIfo[data.serverName]['id'] = data.serverID;
        fullServersIfo[data.serverName]['players'] = data.entries;

        console.log('Retrieved [%s]', data.serverName);
        grunt.file.write(folderName + data.serverName + '.json', JSON.stringify(data.entries));
      };

      var $$q = null;

      SERVERS_LIST.forEach(function (server) {

        if ($$q == null) {
          $$q = retrieveServer(server.name, server.id, cookie);
          $$q.then(onDataExtracted);
          $$q._name = server.name;
        } else {

          var $$q2 = $q.defer();

          $$q.then(function () {
            retrieveServer(server.name, server.id, cookie)
              .then(onDataExtracted)
              .then(function () {
                $$q2.resolve();
              });
          });

          $$q = $$q2.promise;
          $$q._name = server.name;
        }
      });

      $$q.then(function () {
        grunt.file.write(endFileName, JSON.stringify(fullServersIfo));
        done();
      });
    });
  });

  //Sets the version if no arguments adds a suffix
  grunt.registerTask('version', function(){
    setVersion(this.args[0], this.args[1]);
  });

  //Performs commit
  grunt.registerTask('git-commit', function(){
    var msg = this.args[0];

    var cmd ='';

    if(msg) {
      cmd = 'git commit -a -m "(' + msg + ')"';
    } else {
      cmd = 'git commit -a -m "(' + grunt.config('pkg.version') + ')"';
    }

    var result = sh.exec(cmd, {silent:true});

    if(result.code !== 0) { 
      grunt.fatal(result.output);
    }
  });

  //Performs push
  grunt.registerTask('git-push', function(){
    var result = sh.exec('git push');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Publish the application
  grunt.registerTask('publish-patch', function(){

    var msg = grunt.option('message');
    console.log(msg);

    grunt.task.run(['compile', 'version:patch', 'git-commit', 'git-push']);
  });

  /* HELPER FUNCTIONS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Sets the version:
  // type: major, minor, patch
  // suffix: whatever suffix u want
  function setVersion(type, suffix) {
    var file = 'package.json';
    var gruntFile = grunt.file.readJSON(file);

    if(type) {
      gruntFile.version = semver.inc(gruntFile.version, type);
    }

    if(suffix) {
      gruntFile.version += '-' + suffix;
    }

    grunt.log.ok('Version set to ' + gruntFile.version.cyan);
    grunt.config('pkg.version', gruntFile.version);
    grunt.file.write(file, JSON.stringify(gruntFile, null, '  '));
  }

  //Retrieves a string representation of today
  function today() {
    var d = new Date();

    var month = d.getMonth().toString().length == 1 ? '0' + (d.getMonth() + 1).toString() : d.getMonth() + 1;
    var day = d.getDate().toString().length == 1 ? '0' + d.getDate().toString() : d.getDate();
    var year = d.getFullYear();

    return  month + '-' + day + '-' + year ;
  }

  //Retrieves a page
  function retrievePage(serverName, pageNum, data, cookie) {

    var $$q = $q.defer();

    request({
      method: 'POST',
      uri: 'https://en.aion.gameforge.com/website/resources/pubajax/ranking/honorpoints/paging/' + pageNum + '/',
      headers: {
        'user-agent': USER_AGENT,
        'cookie': cookie,
      },
      json: data
    },
      function(error, response, body){

      if(!error && typeof(body) == 'string') {
        //console.log(body);
        error = {
          code: 'BADFORMAT'
        };
      }

      if(error) {
        console.log('[%s:%s] - %s ERROR: %s', serverName, pageNum + 1, data.raceID[0] == '0' ? 'Elyos' : 'Asmodian', error.code);

        if(error.code == 'ETIMEDOUT') {
          retrievePage(serverName, pageNum, data, cookie).then(function (response) {
            $$q.resolve(response);
          });
        } else if(error.code == 'BADFORMAT') {

          console.log('[%s:%s]  BARD FORMAT', serverName, pageNum + 1);
          $$q.resolve({
            entries: []
          });
        } else {
          $$q.reject();
        }
      } else {
        console.log('[%s:%s] - %s Retrieved', serverName, pageNum + 1, data.raceID[0] == '0' ? 'Elyos' : 'Asmodian');
        $$q.resolve(body);
      }
    });


    return $$q.promise;
  }

  //Retrieves whole server
  function retrieveServer(serverName, serverId, cookie) {

    console.log('Extracting [%s]', serverName);

    var results = {
      elyos: [],
      asmodians: []
    };

    var $$topQ = $q.defer();

    var elyosData = {
      characterClassID: ['1', '2',  '4', '5', '7', '8', '10', '11' , '13', '14' , '16'],
      language: ['de', 'fr', 'en', 'tr', 'it', 'es', 'pl'],
      raceID: ['0'],
      serverID: [serverId],
      soldierRankID: null
    };

    var asmodianData = {
      characterClassID: ['1', '2',  '4', '5', '7', '8', '10', '11' , '13', '14' , '16'],
      language: ['de', 'fr', 'en', 'tr', 'it', 'es', 'pl'],
      raceID: ['1'],
      serverID: [serverId],
      soldierRankID: null
    };

    var elyosDataExtractedFn = function(resultData){
      resultData.entries.forEach(function(entry){
        results.elyos.push(entry);
      });
    };

    var asmodianDataExtractedFn = function(resultData){
      resultData.entries.forEach(function(entry){
        results.asmodians.push(entry);
      });
    };


    var $$q = null;

    Array.apply(null, {length: 20}).map(Number.call, Number).forEach(function(i) {

      if($$q == null) {
        $$q = retrievePage(serverName, i, elyosData, cookie)
          .then(elyosDataExtractedFn);
      } else {
        var $$q2 = $q.defer();

        $$q.then(function(){
          retrievePage(serverName, i, elyosData, cookie)
            .then(elyosDataExtractedFn)
            .then(function(){ $$q2.resolve(); });
        });

        $$q = $$q2.promise;
      }
    });

    Array.apply(null, {length: 20}).map(Number.call, Number).forEach(function(i) {
      var $$q2 = $q.defer();

      $$q.then(function(){
        retrievePage(serverName, i, asmodianData, cookie)
          .then(asmodianDataExtractedFn)
          .then(function(){ $$q2.resolve(); });
      });

      $$q = $$q2.promise;
    });

    $$q.then(function(){
      results.elyos = results.elyos.sort(function(a,b){
        return a.position - b.position;
      });

      results.asmodians = results.asmodians.sort(function(a,b){
        return a.position - b.position;
      });
      $$topQ.resolve({serverName: serverName, serverId: serverId, entries: results});
    });

    return $$topQ.promise;
  }

  //Performs login action
  function login(username, password) {

    var $$q = $q.defer();

    request({
      method: 'POST',
      uri: 'https://en.aion.gameforge.com/website/login/',
      headers: {
        'user-agent': USER_AGENT
      },
      form: {
        loginForm: 'loginForm',
        username: username,
        password: password,
      }
    }, function(error, response, body){
      //grunt.file.write('login.html', body);
      $$q.resolve(response['headers']['set-cookie'][0].split(';')[0]);
    });


    return $$q.promise;
  }
};