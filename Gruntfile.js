module.exports = function(grunt) {
  'use strict';

  require('./lib/javascript.extensions.js');
  require('load-grunt-tasks')(grunt);
  require('./nodeApp/blog.tasks.js')(grunt);
  require('./nodeApp/application.tasks.js')(grunt);
  require('./nodeApp/gameforge.server.tasks')(grunt);

  var $q = require('q');
  var request = require('request');
  var semver = require('semver');
  var sh = require('shelljs');
  var colors = require('colors');
  var config = require('./nodeApp/config.js');
  var $log = require('./nodeApp/log.js');

  var licenseTxt = grunt.file.read('LICENSE.TXT');

  var license = '/*\n * Soyto.github.io (<%= pkg.version %>)\n';
  licenseTxt.split('\n').forEach(function(line){
    license += ' * ' + line + '\n';
  });
  license += ' */\n';


  /* GRUNT CONFIG
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  var gruntConfig = {};

  //PACKAGE
  gruntConfig.pkg = grunt.file.readJSON('package.json');

  //JSHINT
  gruntConfig.jshint = {
    options : {jshintrc: '.jshintrc'},
    files: config.application['app-files']
  };

  //CONCAT
  gruntConfig.concat  = {
    options: { banner: license },
    app: {
      options: {separator: '\n\n' },
      src: config.application['app-files'],
      dest: config.application['concat-dest'],
      nonull: true
    }
  };

  //UGLIFY
  gruntConfig.uglify = {
    options: { banner: license },
    app: {
      src: [config.application['concat-dest']],
      dest: config.application['uglify-dest'],
    }
  };

  grunt.initConfig(gruntConfig);


  /* GRUNT TASKS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Default task, just jshint , concat and iglify for the moment
  grunt.registerTask('default', function(){
    grunt.task.run('compile');
  });

  //Compiles application
  grunt.registerTask('compile', function(){
    grunt.task.run('set-up-folders-dates-file');
    grunt.task.run('jshint');
    grunt.task.run('concat:app');
    grunt.task.run('uglify:app');
  });

  //Crates player database
  grunt.registerTask('create-players-database', function(){

    var serversDataFiles = [];

    //Extract server data files
    grunt.file.expand('data/*/*').forEach(function(fileName){

      //If is a character file dont do nothing
      if(fileName.indexOf('Character') >= 0 ||fileName.indexOf('ServersData') >= 0) {
        return;
      }

      var strDate = fileName.split('/')[1];
      var date = strDate.split('-');
      date = new Date(date[2], date[0] - 1, date[1])
      var server = fileName.split('/')[2].split('.')[0];

      var entry = serversDataFiles.first(function(itm){ return itm.server == server; });

      if(entry) {
        entry.dates.push({
          date: date,
          file: fileName
        });
      } else {
        serversDataFiles.push({
          server: server,
          dates: [{date: date, file: fileName}]
        });
      }
    });

    serversDataFiles.forEach(function(serverData) {
      var playersDatabase = [];

      serverData.dates = serverData.dates.sort(function(a, b){
        return a.date > b.date ? 1 : -1;
      });

      serverData.dates.forEach(function(data){
        var file = grunt.file.readJSON(data.file);

        //We want to process em together
        var itms = file.elyos.concat(file.asmodians);

        itms.forEach(function(character){

          var pDatabaseChar = playersDatabase.first(function(pChar){ return pChar.characterID == character.characterID; });

          if(!pDatabaseChar) {

            var dCharacter = {
              characterID: character.characterID,
              characterClassID: character.characterClassID,
              raceID: character.raceID,
              status: [{
                date: data.date,
                position: character.position,
                rankingPositionChange: character.rankingPositionChange,
                gloryPoint: character.gloryPoint,
                gloryPointChange: 0,
                soldierRankID: character.soldierRankID
              }],
              names: [{
                date: data.date,
                characterName : character.characterName,
              }],
              guilds: [{
                date: data.date,
                guildName: character.guildName,
                guildID: character.guildID,
              }]
            };

            playersDatabase.push(dCharacter);
            return;
          }

          var lastStatus = pDatabaseChar.status[pDatabaseChar.status.length -1];
          //Add status
          pDatabaseChar.status.push({
            date: data.date,
            position: character.position,
            rankingPositionChange: lastStatus.position - character.position,
            gloryPoint: character.gloryPoint,
            gloryPointChange: character.gloryPoint - lastStatus.gloryPoint,
            soldierRankID: character.soldierRankID
          });

          //has changed his name?
          var lastName = pDatabaseChar.names[pDatabaseChar.names.length -1];
          if(lastName.characterName != character.characterName) {
            pDatabaseChar.names.push({
              date: data.date,
              characterName : character.characterName,
            });
          }

          //has changed his guild?
          var lastGuild = pDatabaseChar.guilds[pDatabaseChar.guilds.length -1];
          if(lastGuild.guildID != character.guildID) {
            pDatabaseChar.guilds.push({
              date: data.date,
              guildName: character.guildName,
              guildID: character.guildID,
            });
          }

        });

      });

      playersDatabase.forEach(function(character){

        character.characterName = character.names[character.names.length -1].characterName;

        if(character.guilds.length > 0) {
          var lastGuild = character.guilds[character.guilds.length -1];
          character.guildName = lastGuild.guildName;
          character.guildID = lastGuild.guildID;
        }

        var lastStatus = character.status[character.status.length -1];

        character.position = lastStatus.position;
        character.rankingPositionChange = lastStatus.rankingPositionChange;
        character.gloryPoint = lastStatus.gloryPoint;
        character.soldierRankID = lastStatus.soldierRankID;

        var folder =  BASE_FOLDER + 'Characters/' + serverData.server + '/';

        if(!grunt.file.exists(folder)) {
          grunt.file.mkdir(folder);
        }

        var file = folder + character.characterID + '.json';

        grunt.log.ok('Storing [' + serverData.server.cyan + '] (' + character.characterName.green + ')');

        grunt.file.write(file, JSON.stringify(character));

      });
    });

  });
};
