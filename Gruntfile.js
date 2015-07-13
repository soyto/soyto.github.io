module.exports = function(grunt) {

  var $q = require('q');
  var request = require('request');
  var fs = require('fs');

  var serversList = {
    'Alquima': '47',
    'Anuhart': '46',
    'Balder': '39',
    'Barus': '49',
    'Calindi': '45',
    'Curatus': '48',
    'Kromede': '36',
    'Nexus': '44',
    'Perento': '34',
    'Spatalos': '31',
    'Suthran': '42',
    'Telemachus': '32',
    'Thor': '37',
    'Urtem': '40',
    'Vehalla': '43',
    'Zubaba': '51'
  };

  //Your website login and password
  var USER_LOGIN = '******';
  var USER_PASSWORD = '*******';

  var USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36';
  var BASE_FOLDER = 'data/';


  function today() {
    var d = new Date();

    var month = d.getMonth().toString().length == 1 ? '0' + (d.getMonth() + 1).toString() : d.getMonth() + 1;
    var day = d.getDate().toString().length == 1 ? '0' + d.getDate().toString() : d.getDate();
    var year = d.getFullYear();

    return  month + '-' + day + '-' + year ;
  }

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
    }, function(error, response, body){
      console.log('[%s:%s] - %s Retrieved', serverName, pageNum + 1, data.raceID[0] == '0' ? 'Elyos' : 'Asmodian');
      $$q.resolve(body);
    });


    return $$q.promise;
  }

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
          .then(elyosDataExtractedFn)
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


        var names = [];
        var idxs = [];

        for (var serverName in serversList) {
          names.push(serverName);
          idxs.push(serversList[serverName]);
        }

        var $$q = null;

        names.forEach(function (serverName, idx) {
          var serverId = idxs[idx];

          if ($$q == null) {
            $$q = retrieveServer(serverName, serverId, cookie);
            $$q.then(onDataExtracted);
            $$q._name = serverName;
          } else {

            var $$q2 = $q.defer();

            $$q.then(function () {
              retrieveServer(serverName, serverId, cookie)
                .then(onDataExtracted)
                .then(function () {
                  $$q2.resolve();
                });
            });

            $$q = $$q2.promise;
            $$q._name = serverName;
          }
        });

        $$q.then(function () {
          grunt.file.write(endFileName, JSON.stringify(fullServersIfo));
          done();
        });
      });
  });
};