/* global require */
module.exports = new function() {

  'use strict';

  var NUM_PAGES_PER_SERVER = 20;

  var $q        = require('q');
  var $log      = require('../nodeApp/log');
  var request   = require('request');
  var colors    = require('colors');
  var extend    = require('util')._extend;
  var grunt      = require('grunt');

  require('../lib/javascript.extensions.js');

  var  $this = this;

  //List of all servers
  $this.servers = [

    //New servers IDs and names
    {'id': 53, 'name': 'Antriksha'},
    {'id': 49, 'name': 'Barus'},
    {'id': 52, 'name': 'Deyla'},
    {'id': 54, 'name': 'Hellion'},
    {'id': 55, 'name': 'Hyperion'},
    {'id': 50, 'name': 'Loki'},
    {'id': 37, 'name': 'Thor'},
    {'id': 40, 'name': 'Urtem'},
  ];

  //Performs login action and returns the cookie
  $this.login = function(userAgent) {
    var $$q = $q.defer();

    $log.debug('Performin login');

    var requestData = {
      'method': 'GET',
      'uri': 'https://en.aion.gameforge.com/website',
      'headers': {
        'user-agent': userAgent
      }
    };

    var onRequestFn = function(error, response, body) {
      if(response['headers']['set-cookie']) {
        var _cookie = response['headers']['set-cookie'][0].split(';')[0];
        $log.debug('Retrieved cookie -> %s', colors.cyan(_cookie));
        $$q.resolve(_cookie);
	    }
      else {
	       $$q.reject('Coulnd\'t login');
	    }
    };


    request(requestData, onRequestFn);

    return $$q.promise;
  };

  //Retrieves one server
  $this.retrieveServer = function(serverName, serverId, cookie, userAgent) {
    $log.debug('Extracting [%s]', colors.cyan(serverName));

    var results = {
      elyos: [],
      asmodians: [],
      errors: []
    };

    var requestData = {
      characterClassID: ['1', '2',  '4', '5', '7', '8', '10', '11' , '13', '14' , '16'],
      raceID: [],
      serverID: [serverId],
      soldierRankID: null,
      sortBy: 'POSITION',
      order: 'ASC'
    };

    var $$q = $q.resolve();

    var indexes = Array.apply(null, {length: NUM_PAGES_PER_SERVER}).map(Number.call, Number);

    //Extract  elyos data
    indexes.forEach(function(i) {

      var _requestData = extend({}, requestData);
      _requestData.raceID = [0];

      $$q = $$q.then(function(){
        return $this
          .retrievePage(serverName, i, _requestData, cookie, userAgent)
          .then(function(data) {

            if(data.error) {
              results.errors.push({
                pageNum: i,
                faction: 0,
                error: data.error
              });
            }
            else {
              data.entries.forEach(function(entry){
                results.elyos.push(entry);
              });
            }
        });
      });
    });

    //Extract asmodian data
    indexes.forEach(function(i) {

      var _requestData = extend({}, requestData);
      _requestData.raceID = [1];

      $$q = $$q.then(function(){
        return $this
          .retrievePage(serverName, i, _requestData, cookie, userAgent)
          .then(function(data) {

            if(data.error) {
              results.errors.push({
                pageNum: i,
                faction: 1,
                error: data.error
              });
            }
            else {
              data.entries.forEach(function(entry){
                results.asmodians.push(entry);
              });
            }
        });
      });
    });

    //When all is over
    return  $$q.then(function(){
      var sortFn = function(a, b) { return a.position - b.position; };

      results.elyos = results.elyos.sort(sortFn);
      results.asmodians = results.asmodians.sort(sortFn);

      return {
        serverName: serverName,
        serverId: serverId,
        entries: {
          elyos: results.elyos,
          asmodians: results.asmodians
        },
        errors: results.errors
      };
    });
  };

  //Retrieves one page
  $this.retrievePage = function(serverName, pageNum, data, cookie, userAgent) {
    var $$q = $q.defer();

    var page = pageNum + 1;
    var race_str_colored = data.raceID[0] == '0' ? colors.green('Elyos') : colors.magenta('Asmodian');

    var requestData = {
      method: 'POST',
      uri: 'https://en.aion.gameforge.com/website/resources/pubajax/ranking/honorpoints/paging/' + pageNum + '/',
      timeout: 10000,
      headers: {
        'user-agent': userAgent,
        'cookie': cookie,
        'X-Requested-With': 'XMLHttpRequest'
      },
      json: data
    };

    var responseFn = function(error, httpResponse, body) {

      //Object with the response
      var response = {
        entries: [],
        error: null,
        serverName: serverName,
        pageNum: pageNum,
        data: data
      };

      //If body is a string we are on a badFormat
      if(typeof body == 'string' && !error) {
        error = {
          code: 'BADFORMAT'
        };
      }

      if(error) {

        if(error.code == 'ETIMEDOUT') {
          $log.debug('[%s:%s] ---- %s', colors.cyan(serverName), colors.yellow(pageNum + 1), colors.yellow('TIMEOUT'));
          $this.retrievePage(serverName, pageNum, data, cookie, userAgent).then($$q.resolve);
        }
        else if(error.code == 'BADFORMAT') {
          $log.debug('[%s:%s] ---- %s', colors.cyan(serverName), colors.yellow(pageNum + 1), colors.red('BAD FORMAT'));

          response.error = {
            msg: 'BADFORMAT'
          };

          $$q.resolve(response);
        }
        else {
          response.error = error;
          $$q.reject(response);
        }
      }
      else {

        if(!body.entries) {
          $log.debug(JSON.stringify(body));
        }

        $log.debug('[%s:%s-%s] >>>> Downloaded %s characters',
          colors.cyan(serverName),
          colors.yellow(pageNum + 1),
          race_str_colored,
          colors.green(body.entries.length)
        );

        response.entries = body.entries;

        $$q.resolve(response);
      }
    };

    //Perform the request
    request(requestData, responseFn);

    return $$q.promise;
  };

  //Generate characterInfo array
  $this.generateCharacterInfo = function(dateEntries) {

    //Here we will store the characters itselfs
    var storedCharacters = [];

    //Fn that will help retrieving character by id
    var getCharacterById = function(id) {
      return storedCharacters.first(function(itm){ return itm['characterID'] == id; });
    };

    dateEntries.forEach(function(dateEntry) {
      dateEntry['characters'].forEach(function(character){
        //Try to retrieve character by id
        var storedCharacter = getCharacterById(character.characterID);

        //If character isn't stored, store it now
        if(!storedCharacter) {

          storedCharacter = {
            characterID: character.characterID,
            characterClassID: character.characterClassID,
            raceID: character.raceID,

            position: character.position,
            rankingPositionChange: character.rankingPositionChange,
            gloryPoint: character.gloryPoint,
            gloryPointChange: 0,
            soldierRankID: character.soldierRankID,

            characterName: character.characterName,

            guildName: character.guildName,
            guildID: character.guildID
          };

          storedCharacter.status = [{
              date: dateEntry.date,
              position: character.position,
              rankingPositionChange: character.rankingPositionChange,
              gloryPoint: character.gloryPoint,
              gloryPointChange: 0,
              soldierRankID: character.soldierRankID
          }];

          storedCharacter.names = [{
              date: dateEntry.date,
              characterName : character.characterName
          }];

          storedCharacter.guilds = [{
              date: dateEntry.date,
              guildName: character.guildName,
              guildID: character.guildID,
          }];

          storedCharacters.push(storedCharacter);
        }
        else {

          //If is stored we need to update it
          var lastStatus = storedCharacter.status[storedCharacter.status.length - 1];
          var lastName = storedCharacter.names[storedCharacter.names.length - 1];
          var lastGuild = storedCharacter.guilds[storedCharacter.guilds.length - 1];

          //Update it's status
          storedCharacter.status.push({
            date: dateEntry.date,
            position: character.position,
            rankingPositionChange: lastStatus.position - character.position,
            gloryPoint: character.gloryPoint,
            gloryPointChange: character.gloryPoint - lastStatus.gloryPoint,
            soldierRankID: character.soldierRankID
          });

          //Name changed?
          if(lastName.characterName != character.characterName) {
            storedCharacter.names.push({
              date: dateEntry.date,
              characterName : character.characterName
            });
          }

          //Guild changed?
          if(lastGuild.guildID != character.guildID) {
            storedCharacter.guilds.push({
              date: dateEntry.date,
              guildName: character.guildName,
              guildID: character.guildID,
            });
          }

          //Update character itself
          storedCharacter.position = character.position;
          storedCharacter.rankingPositionChange = lastStatus.position - character.position;
          storedCharacter.gloryPoint = character.gloryPoint;
          storedCharacter.gloryPointChange = character.gloryPoint - lastStatus.gloryPoint;
          storedCharacter.soldierRankID = character.soldierRankID;

          storedCharacter.characterName = character.characterName;

          storedCharacter.guildName = character.guildName;
          storedCharacter.guildID = character.guildID;
        }
      });
    });

    return storedCharacters;
  };

  //Updates a character with new serverData
  $this.updateCharacters = function(serverData, charactersFolder, consoleLog) {
    if(consoleLog === undefined) {
      consoleLog = 'all';
    }

    var _rankedCharacters = serverData['entries']['elyos'].concat(serverData['entries']['asmodians']);
    var _storedCharacerIDs = grunt.file.expand(charactersFolder + '*.json').select(function($$fileName){
      var _parts = $$fileName.split('/');
      return parseInt(_parts[_parts.length -1].split('.')[0]);
    });

    //Loop ranked characters
    _rankedCharacters.forEach(function($$character) {
      var _characterID = $$character['characterID'];
      var _characterFile = charactersFolder + _characterID + '.json';

      var _storedCharacter = {};

      var _characterExists = _storedCharacerIDs.indexOf(_characterID) >= 0;

      //If character exists...
      if(_characterExists) {

        //Read storedCharacter from JSON
        _storedCharacter = grunt.file.readJSON(_characterFile);

        //Sort status
        _storedCharacter['status'].sort(function(a, b){ return (new Date(a['date'])).getTime() - (new Date(b['date'])).getTime(); });

        var _lastStatus = _storedCharacter['status'][_storedCharacter['status'].length -1];

        //If character was already updated
        if((new Date(_lastStatus['date'])).getTime() == (new Date(serverData['date'])).getTime()) {
          //If character only has one status
          if(_storedCharacter['status'].length === 1) {
            _storedCharacter['status'].splice(0, 1);
            _lastStatus = null;
          }
          else {
            _storedCharacter['status'].splice(_storedCharacter['status'].length - 1, 1);
            _lastStatus = _storedCharacter['status'][_storedCharacter['status'].length - 1];
          }
        }

        var _lastName = _storedCharacter['names'][_storedCharacter['names'].length - 1];
        var _lastGuild = _storedCharacter['guilds'][_storedCharacter['guilds'].length - 1];

        //Set up new status
        var _newStatus = {
          'date': serverData['date'],
          'position': $$character['position'],
          'rankingPositionChange': $$character['rankingPositionChange'],
          'gloryPoint': $$character['gloryPoint'],
          'gloryPointChange': 0,
          'soldierRankID': $$character['soldierRankID']
        };

        //If last status wasnt null
        if(_lastStatus !== null) {
          _newStatus['gloryPointChange'] = _newStatus['gloryPoint'] - _lastStatus['gloryPoint'];
          _newStatus['rankingPositionChange'] = _lastStatus['position'] - _newStatus['position'];
        }

        //Add character status
        _storedCharacter['status'].push(_newStatus);

        //We only store last 100 status...
        if(_storedCharacter['status'].length > 100) {
          var _statusLength = _storedCharacter['status'].length;
          _storedCharacter['status'].splice(0, _statusLength - 50)
        }

        //Has changed name?
        if(_lastName['characterName'] != $$character['characterName']) {
          _storedCharacter['names'].push({
            'date': serverData['date'],
            'characterName' : $$character['characterName'],
          });
        }

        //Has changed guild?
        if(_lastGuild['guildID'] != $$character['guildID']) {
          _storedCharacter['guilds'].push({
            'date': serverData['date'],
            'guildName': $$character['guildName'],
            'guildID': $$character['guildID'],
          });
        }

        //Update character itself
        _storedCharacter['position'] = $$character['position'];
        _storedCharacter['rankingPositionChange'] = _newStatus['rankingPositionChange'];
        _storedCharacter['gloryPoint'] = $$character['gloryPoint'];
        _storedCharacter['gloryPointChange'] = _newStatus['gloryPointChange'];
        _storedCharacter['soldierRankID'] = $$character['soldierRankID'];
        _storedCharacter['characterName'] = $$character['characterName'];
        _storedCharacter['guildName'] = $$character['guildName'];
        _storedCharacter['guildID'] = $$character['guildID'];

        //We update serverCharacter
        $$character['rankingPositionChange'] = _storedCharacter['rankingPositionChange'];
        $$character['gloryPointChange'] = _storedCharacter['gloryPointChange'];
      }
      else { //If character doesnt exists

        _storedCharacter = {
          'characterID': $$character['characterID'],
          'characterClassID': $$character['characterClassID'],
          'raceID': $$character['raceID'],

          'position': $$character['position'],
          'rankingPositionChange': $$character['rankingPositionChange'],
          'gloryPoint': $$character['gloryPoint'],
          'gloryPointChange': 0,
          'soldierRankID': $$character['soldierRankID'],

          'characterName': $$character['characterName'],

          'guildName': $$character['guildName'],
          'guildID': $$character['guildID'],

          'status': [],
          'names': [],
          'guilds': []
        };

        //Add character status
        _storedCharacter['status'].push({
          'date': serverData['date'],
          'position': $$character['position'],
          'rankingPositionChange': $$character['rankingPositionChange'],
          'gloryPoint': $$character['gloryPoint'],
          'gloryPointChange': 0,
          'soldierRankID': $$character['soldierRankID']
        });

        //Add character name
        _storedCharacter['names'].push({
          'date': serverData['date'],
          'characterName': $$character['characterName']
        });

        //Add character guilds
        _storedCharacter['guilds'].push({
          'date': serverData['date'],
          'guildName': $$character['guildName'],
          'guildID': $$character['guildID']
        });

        $$character['gloryPointChange'] = 0;
      }

      if(consoleLog == 'all'){
        $log.debug('Storing [%s:%s] characterInfo',
            colors.yellow(serverData['serverName']),
            colors.cyan($$character['characterName']));
      }
      else if(consoleLog == 'onlyNews' && !_characterExists) {
        $log.debug('Creating [%s:%s]', colors.yellow(serverData['serverName']), colors.cyan($$character['characterName']));
      }

      grunt.file.write(_characterFile, JSON.stringify(_storedCharacter));
    });

  };

  //Will update server characters from the storedCharacters
  $this.updateServerCharacters = function(storedCharacters, serverData) {

    //We need all server characters in one array
    var serverCharacters = serverData.entries.elyos.concat(serverData.entries.asmodians);

    //Fn that will help retrieving character by id
    var getStoredCharacterById = function(id) {
      return storedCharacters.first(function(itm){ return itm.characterID == id; });
    };

    //Loop serverCharacters
    serverCharacters.forEach(function(serverCharacter){

      //try to retrieve serverCharacter from storedCharacters
      var storedCharacter = getStoredCharacterById(serverCharacter.characterID);

      //If it wasnt' stored
      if(!storedCharacter) {

        //Generate the storedCharacter
        storedCharacter = {
          characterID: serverCharacter.characterID,
          characterClassID: serverCharacter.characterClassID,
          raceID: serverCharacter.raceID,

          position: serverCharacter.position,
          rankingPositionChange: serverCharacter.rankingPositionChange,
          gloryPoint: serverCharacter.gloryPoint,
          gloryPointChange: 0,
          soldierRankID: serverCharacter.soldierRankID,

          characterName: serverCharacter.characterName,

          guildName: serverCharacter.guildName,
          guildID: serverCharacter.guildID
        };

        storedCharacter.status = [{
            date: serverData.date,
            position: serverCharacter.position,
            rankingPositionChange: serverCharacter.rankingPositionChange,
            gloryPoint: serverCharacter.gloryPoint,
            gloryPointChange: 0,
            soldierRankID: serverCharacter.soldierRankID
        }];

        storedCharacter.names = [{
            date: serverData.date,
            characterName : serverCharacter.characterName
        }];

        storedCharacter.guilds = [{
            date: serverData.date,
            guildName: serverCharacter.guildName,
            guildID: serverCharacter.guildID,
        }];

        //Append it to the storedCharacters array
        storedCharacters.push(storedCharacter);

        //Set up the gloryPointChange
        serverCharacter.gloryPointChange = 0;

        //Return aka continue
        return;
      }
      else {

        //Here we have a trouble, maybe the date is the same as now,
        // we will know looking on the last status
        storedCharacter.status.sort(function(a, b){ return a.date > b.date ? 1 : -1; });

        //Retrieve last status
        var lastStatus = storedCharacter.status[storedCharacter.status.length - 1];

        //If is same date...
        if(lastStatus.date.getTime() === serverData.date.getTime()) {

          //If the character only have one status...
          if(storedCharacter.status.length === 1) {

            //Set up the unique status
            storedCharacter.status = [{
                date: serverData.date,
                position: serverCharacter.position,
                rankingPositionChange: serverCharacter.rankingPositionChange,
                gloryPoint: serverCharacter.gloryPoint,
                gloryPointChange: 0,
                soldierRankID: serverCharacter.soldierRankID
            }];

            storedCharacter.names = [{
                date: serverData.date,
                characterName : serverCharacter.characterName
            }];

            storedCharacter.guilds = [{
                date: serverData.date,
                guildName: serverCharacter.guildName,
                guildID: serverCharacter.guildID,
            }];

            //Set up the gloryPointChange
            serverCharacter.gloryPointChange = 0;

            //return aka break
            return;
          }
          else {

            //We extract the previous lastStatus
            lastStatus = storedCharacter.status[storedCharacter.status.length - 2];

          }
        }

        var lastName = storedCharacter.names[storedCharacter.names.length - 1];
        var lastGuild = storedCharacter.guilds[storedCharacter.guilds.length - 1];

        //Now we update the storedCharacter
        storedCharacter.status.push({
          date: serverData.date,
          position: serverCharacter.position,
          rankingPositionChange: lastStatus.position - serverCharacter.position,
          gloryPoint: serverCharacter.gloryPoint,
          gloryPointChange: serverCharacter.gloryPoint - lastStatus.gloryPoint,
          soldierRankID: serverCharacter.soldierRankID
        });

        //has changed his name?
        if(lastName.characterName != serverCharacter.characterName) {
          storedCharacter.names.push({
            date: serverData.date,
            characterName : serverCharacter.characterName,
          });
        }

        //has changed his guild?
        if(lastGuild.guildID != serverCharacter.guildID) {
          storedCharacter.guilds.push({
            date: serverData.date,
            guildName: serverCharacter.guildName,
            guildID: serverCharacter.guildID,
          });
        }

        //Update character itself
        storedCharacter.position = serverCharacter.position;
        storedCharacter.rankingPositionChange = lastStatus.position - serverCharacter.position;
        storedCharacter.gloryPoint = serverCharacter.gloryPoint;
        storedCharacter.gloryPointChange = serverCharacter.gloryPoint - lastStatus.gloryPoint;
        storedCharacter.soldierRankID = serverCharacter.soldierRankID;

        storedCharacter.characterName = serverCharacter.characterName;

        storedCharacter.guildName = serverCharacter.guildName;
        storedCharacter.guildID = serverCharacter.guildID;

        //We update serverCharacter
        serverCharacter.rankingPositionChange = storedCharacter.rankingPositionChange;
        serverCharacter.gloryPointChange = storedCharacter.gloryPointChange;
      }

    });

  };
}();
