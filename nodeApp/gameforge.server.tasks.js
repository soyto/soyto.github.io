/* global require */
module.exports = function(grunt) {
  'use strict';

  var gameForgeServer   = require('../nodeApp/gameforge.server');
  var blog              = require('../nodeApp/blog');
  var config            = require('../nodeApp/config.js');
  var moment            = require('moment');
  var $log              = require('../nodeApp/log');
  var $q                = require('q');
  var colors            = require('colors');
  var o2x               = require('object-to-xml');

  require('../lib/javascript.extensions.js');

  var baseFolder            = config.application['base-folder'];
  var postsFolder           = config.application['posts-folder'];
  var appFolder             = config.application['app-folder'];
  var USER_AGENT            = config.crawler['user-agent'];
  var charactersBaseFolder  = baseFolder + 'Servers/Characters/';
  var temporalBaseFolder    = baseFolder + 'tmp/';

  //Performs the full crawler
  grunt.registerTask('crawler', function() {
    var _done = this.async();
    var _folderName  = baseFolder + 'Servers/' + moment().format('MM-DD-YYYY') + '/';

    //Here we will store servers data, stats and errors
    var _servers = null;
    var globalStats = {
      topHP: null,
      topPositionChange: null,
      lowerPositionChange: null
    };
    var _crawlerErrors = [];

    //If folder doesn't exists, just create it
    if(!grunt.file.exists(_folderName)) {
      grunt.file.mkdir(_folderName);
    }

    //1st step: Perform login
    var sp = gameForgeServer.login(USER_AGENT);

    //2nd step, retrieve all servers data
    sp = sp.then(function(cookie){

      //just cutted off for limit
      return _retrieveServersData(cookie, gameForgeServer['servers'], USER_AGENT).then(function($$allServersData){
        _servers = $$allServersData;

        //When is done, we store tmp file for each server, if something wents bad this data is stored atleast
        _servers.forEach(function($$server) {
          $log.debug('Storing [%s] server on tempFolder', colors.cyan($$server['serverName']));
          grunt.file.write(temporalBaseFolder + $$server['serverName'] + '.json', JSON.stringify($$server));
        });
      });
    });

    //3d step, check and store errors
    sp = sp.then(function(){
      _servers.forEach(function(server) {
        if(server['errors'] && server['errors'].length > 0) {
          _crawlerErrors.push({
            'serverName' : server['serverName'],
            'serverId': server['serverId'],
            'errors': server['errors']
          });
        }
      });
    });

    //4th step we need to extract players info for each server
    sp = sp.then(function() {
      _servers.forEach(_extractPlayersInfo);
    });

    //5th step, generate server stats
    sp = sp.then(function() {
      _servers.forEach(function(server){

        server.entries.stats = {};
        server.entries.stats.elyos = {
          topHP: null,
          topPositionChange: null,
          lowerPositionChange: null
        };
        server.entries.stats.asmodians = {
          topHP: null,
          topPositionChange: null,
          lowerPositionChange: null
        };

        //Loop elyos
        server.entries.elyos.forEach(function(character) {
          var stat = server.entries.stats.elyos;

          if(!stat.topHP || stat.topHP.gloryPointChange < character.gloryPointChange) {
            stat.topHP = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              gloryPointChange: character.gloryPointChange
            };
          }

          if(!stat.topPositionChange || stat.topPositionChange.rankingPositionChange < character.rankingPositionChange) {
            stat.topPositionChange = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              rankingPositionChange: character.rankingPositionChange
            };
          }

          if(!stat.lowerPositionChange || stat.lowerPositionChange.rankingPositionChange > character.rankingPositionChange) {
            stat.lowerPositionChange = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              rankingPositionChange: character.rankingPositionChange
            };
          }

        });

        //Now loop asmodians
        server.entries.asmodians.forEach(function(character) {
          var stat = server.entries.stats.asmodians;

          if(!stat.topHP || stat.topHP.gloryPointChange < character.gloryPointChange) {
            stat.topHP = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              gloryPointChange: character.gloryPointChange
            };
          }

          if(!stat.topPositionChange || stat.topPositionChange.rankingPositionChange < character.rankingPositionChange) {
            stat.topPositionChange = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              rankingPositionChange: character.rankingPositionChange
            };
          }

          if(!stat.lowerPositionChange || stat.lowerPositionChange.rankingPositionChange > character.rankingPositionChange) {
            stat.lowerPositionChange = {
              characterName: character.characterName,
              characterID: character.characterID,
              guildName: character.guildName,
              guildID: character.guildID,
              rankingPositionChange: character.rankingPositionChange
            };
          }
        });

        //Global stats
        var elyosStats = server.entries.stats.elyos;
        var asmodianStats = server.entries.stats.asmodians;

        //Pick up best of servers ones
        var serverTopHP = elyosStats.topHP.gloryPointChange > asmodianStats.topHP.gloryPointChange ?
            elyosStats.topHP :
            asmodianStats.topHP;

        var serverTopPositionChange = elyosStats.topPositionChange.rankingPositionChange > asmodianStats.topPositionChange.rankingPositionChange ?
            elyosStats.topPositionChange :
            asmodianStats.topPositionChange;

        var serverLowerPositionChange = elyosStats.lowerPositionChange.rankingPositionChange < asmodianStats.lowerPositionChange.rankingPositionChange ?
            elyosStats.lowerPositionChange :
            asmodianStats.lowerPositionChange;

        //Check and generate servers tops

        if(!globalStats.topHP || serverTopHP.gloryPointChange > globalStats.topHP.gloryPointChange) {
          globalStats.topHP = serverTopHP;
          globalStats.topHP.serverName = server.serverName;
          globalStats.topHP.serverId = server.serverId;
        }

        if(!globalStats.topPositionChange || serverTopPositionChange.rankingPositionChange > globalStats.topPositionChange.rankingPositionChange) {
          globalStats.topPositionChange = serverTopPositionChange;
          globalStats.topPositionChange.serverName = server.serverName;
          globalStats.topPositionChange.serverId = server.serverId;
        }

        if(!globalStats.lowerPositionChange || serverLowerPositionChange.rankingPositionChange > globalStats.lowerPositionChange.rankingPositionChange) {
          globalStats.lowerPositionChange = serverLowerPositionChange;
          globalStats.lowerPositionChange.serverName = server.serverName;
          globalStats.lowerPositionChange.serverId = server.serverId;
        }
      });
    });

    //6th step, store servers data
    sp = sp.then(function() {

      _servers.forEach(function(server) {
        $log.debug('Storing [%s] server', colors.cyan(server.serverName));
        grunt.file.write(_folderName + server.serverName + '.json', JSON.stringify(server.entries));
      });

      //When is all done, we remove all temporal data files
      grunt.file.expand(temporalBaseFolder + '*.js').forEach(function(file){
        grunt.file.delete(file);
      });

      //Generate dates file
      _generateDatesFile();

    });

    //7th step, generate blog post
    sp = sp.then(function() {
      _generateBlogPost(_crawlerErrors, globalStats);
    });

    //8th step, generate character sheet
    sp = sp.then(function(){
      _createPlayersCheatSheet()
    });

    //Confirm all
    sp.then(function(){
      _done();
    });
  });

  //Performs crawler with stored data on tmp folder (Just in case crawler fails)
  grunt.registerTask('crawler-offline', function() {

    var today                 = moment().format('MM-DD-YYYY');
    var folderName            = baseFolder + 'Servers/' + today + '/';

    //Here we will store servers data, stats and errors
    var servers = [];
    var globalStats = {
      topHP: null,
      topPositionChange: null,
      lowerPositionChange: null
    };
    var crawlerErrors = [];

    //If folder doesn't exists, just create it
    if(!grunt.file.exists(folderName)) {
      grunt.file.mkdir(folderName);
    }

    //1st step, not loging required

    //2n step. read all from tmp folder
    grunt.file.expand(temporalBaseFolder + '*.json').forEach(function(file){
      servers.push(grunt.file.readJSON(file));
    });

    //3d step, check and store errors
    servers.forEach(function(server) {
      if(server.errors && server.errors.length > 0) {
        crawlerErrors.push({
          serverName : server.serverName,
          serverId: server.serverId,
          errors: server.errors
        });
      }
    });

    //4th step we need to extract players info for each server
    servers.forEach(_extractPlayersInfo);

    //5th step, generate server stats
    servers.forEach(function(server){

      server.entries.stats = {};
      server.entries.stats.elyos = {
        topHP: null,
        topPositionChange: null,
        lowerPositionChange: null
      };
      server.entries.stats.asmodians = {
        topHP: null,
        topPositionChange: null,
        lowerPositionChange: null
      };

      //Loop elyos
      server.entries.elyos.forEach(function(character) {
        var stat = server.entries.stats.elyos;

        if(!stat.topHP || stat.topHP.gloryPointChange < character.gloryPointChange) {
          stat.topHP = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            gloryPointChange: character.gloryPointChange
          };
        }

        if(!stat.topPositionChange || stat.topPositionChange.rankingPositionChange < character.rankingPositionChange) {
          stat.topPositionChange = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            rankingPositionChange: character.rankingPositionChange
          };
        }

        if(!stat.lowerPositionChange || stat.lowerPositionChange.rankingPositionChange > character.rankingPositionChange) {
          stat.lowerPositionChange = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            rankingPositionChange: character.rankingPositionChange
          };
        }

      });

      //Now loop asmodians
      server.entries.asmodians.forEach(function(character) {
        var stat = server.entries.stats.asmodians;

        if(!stat.topHP || stat.topHP.gloryPointChange < character.gloryPointChange) {
          stat.topHP = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            gloryPointChange: character.gloryPointChange
          };
        }

        if(!stat.topPositionChange || stat.topPositionChange.rankingPositionChange < character.rankingPositionChange) {
          stat.topPositionChange = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            rankingPositionChange: character.rankingPositionChange
          };
        }

        if(!stat.lowerPositionChange || stat.lowerPositionChange.rankingPositionChange > character.rankingPositionChange) {
          stat.lowerPositionChange = {
            characterName: character.characterName,
            characterID: character.characterID,
            guildName: character.guildName,
            guildID: character.guildID,
            rankingPositionChange: character.rankingPositionChange
          };
        }
      });

      //Global stats
      var elyosStats = server.entries.stats.elyos;
      var asmodianStats = server.entries.stats.asmodians;

      //Pick up best of servers ones
      var serverTopHP = elyosStats.topHP.gloryPointChange > asmodianStats.topHP.gloryPointChange ?
          elyosStats.topHP :
          asmodianStats.topHP;

      var serverTopPositionChange = elyosStats.topPositionChange.rankingPositionChange > asmodianStats.topPositionChange.rankingPositionChange ?
          elyosStats.topPositionChange :
          asmodianStats.topPositionChange;

      var serverLowerPositionChange = elyosStats.lowerPositionChange.rankingPositionChange < asmodianStats.lowerPositionChange.rankingPositionChange ?
          elyosStats.lowerPositionChange :
          asmodianStats.lowerPositionChange;

      //Check and generate servers tops

      if(!globalStats.topHP || serverTopHP.gloryPointChange > globalStats.topHP.gloryPointChange) {
        globalStats.topHP = serverTopHP;
        globalStats.topHP.serverName = server.serverName;
        globalStats.topHP.serverId = server.serverId;
      }

      if(!globalStats.topPositionChange || serverTopPositionChange.rankingPositionChange > globalStats.topPositionChange.rankingPositionChange) {
        globalStats.topPositionChange = serverTopPositionChange;
        globalStats.topPositionChange.serverName = server.serverName;
        globalStats.topPositionChange.serverId = server.serverId;
      }

      if(!globalStats.lowerPositionChange || serverLowerPositionChange.rankingPositionChange > globalStats.lowerPositionChange.rankingPositionChange) {
        globalStats.lowerPositionChange = serverLowerPositionChange;
        globalStats.lowerPositionChange.serverName = server.serverName;
        globalStats.lowerPositionChange.serverId = server.serverId;
      }
    });

    //6th step, store servers data
    servers.forEach(function(server) {
      $log.debug('Storing [%s] server', colors.cyan(server.serverName));
      grunt.file.write(folderName + server.serverName + '.json', JSON.stringify(server.entries));
    });

    //When is all done, we remove all temporal data files
    grunt.file.expand(temporalBaseFolder + '*.js').forEach(function(file){
      grunt.file.delete(file);
    });

    //Generate dates file
    _generateDatesFile();

    //7th step, generate blog post
    _generateBlogPost(crawlerErrors, globalStats);
  });

  //Generates players database
  grunt.registerTask('create-players-database', function() {
    gameForgeServer.servers.forEach(function(server){

      var _charactersFolder = charactersBaseFolder + server['name'] + '/';
      var _serverFiles = grunt.file.expand(baseFolder + '/Servers/*/' + server.name + '.json').sort(_sortServerFilesAsc);

      //Delete the character Folder (Bye bye data... :S)
      grunt.file.delete(_charactersFolder);

      //Start looping each serverFile
      _serverFiles.forEach(function($$file){
        var _data = grunt.file.readJSON($$file);
        var _serverData = {
          'serverName': server['name'],
          'entries': {
            'elyos': _data['elyos'],
            'asmodians': _data['asmodians']
          },
          'date': $$file.split('/')[2]
        };

        $log.debug('Processing characters for [%s, %s]',
            colors.yellow(server['name']),
            colors.cyan(_serverData['date']));

        //Tell to update characters
        gameForgeServer.updateCharacters(_serverData, _charactersFolder, 'onlyNews');
      });
    });
  });

  //Creates characterSheets json
  grunt.registerTask('create-players-cheatsheet', 'creates charactersSheet.json file', _createPlayersCheatSheet);

  //Generates dates-files
  grunt.registerTask('generate-dates-file' , _generateDatesFile);

  //Will generate dates file
  function _generateDatesFile() {
    var folderDates = grunt.file.expand(baseFolder + 'Servers/*').where(function(folderName) {
      return folderName.split('-').length == 3;
    }).select(function(folderName){
      return folderName.split('/')[2];
    });

    //Sort folders dates
    folderDates.sort(function(a, b){
      return (new Date(a)).getTime() - (new Date(b)).getTime();
    });


    grunt.file.write(appFolder + 'helpers/folders.dates.js', 'window.storedDates = ' + JSON.stringify(folderDates, null, ' ').replace(/"/g, '\'') + ';');
  }

  //Will retrieve all servers data
  function _retrieveServersData(cookie, serversList, userAgent) {
    var $$q = $q.resolve();

    var _serversFullData = [];

    serversList.forEach(function($$server) {
      $$q = $$q.then(function(){
        return gameForgeServer.retrieveServer($$server['name'], $$server['id'], cookie, userAgent).then(function($$serverData) {

        //Notify that all is succesfully
        $log.debug('Retrieved [%s]', colors.cyan($$server['name']));

        //Push to the array
          _serversFullData.push($$serverData);
        });
      });
    });

    return $$q.then(function(){
      return _serversFullData;
    });

  }

  //Extract per server playersInfo
  function _extractPlayersInfo(serverData) {

    //Set date on server
    serverData['date'] = new Date(moment().format('MM-DD-YYYY'));

    var _charactersFolder = charactersBaseFolder + serverData.serverName + '/';

    //Tell to update characters
    gameForgeServer.updateCharacters(serverData, _charactersFolder);
  }

  //Generates blog post
  function _generateBlogPost(crawlerErrors, globalStats) {
    var fileName = moment().format('YYYY-MM-DD.HH-mm') + '.' + moment().format('MM-DD-YYYY') + '-data.md';

    var fileTxt = '';

    //First we set up errors if we have some
    if(crawlerErrors.length > 0 ) {
      fileTxt += '### Errors on crawler·\n';
      crawlerErrors.forEach(function(crawlerError) {

        var serverName = generateLink(crawlerError.serverName, '/#/ranking/' + crawlerError.serverName);

        crawlerError.errors.forEach(function(error){

          var faction = error.faction === 0 ? 'elyos' : 'asmodians';
          var start = (error.pageNum * 50) + 1;
          var end = (error.pageNum + 1) * 50;

          fileTxt += '- ' + serverName + ' ' + faction + ': positions ' + start + ' to ' + end + '\n';
        });
      });
    }

    var topHPChar = generateLink(globalStats.topHP.characterName, '/#/character/' + globalStats.topHP.serverName + '/' + globalStats.topHP.characterID);
    var topHPServer = generateLink(globalStats.topHP.serverName, '/#/ranking/' + globalStats.topHP.serverName);
    var topHPStat = globalStats.topHP.gloryPointChange;

    var topPositionChangeChar = generateLink(globalStats.topPositionChange.characterName, '/#/character/' + globalStats.topPositionChange.serverName + '/' + globalStats.topPositionChange.characterID);
    var topPositionChangeServer = generateLink(globalStats.topPositionChange.serverName, '/#/ranking/' + globalStats.topPositionChange.serverName);
    var topPositionChangeStat = globalStats.topPositionChange.rankingPositionChange;

    var lowerPositionChangeChar = generateLink(globalStats.lowerPositionChange.characterName, '/#/character/' + globalStats.lowerPositionChange.serverName + '/' + globalStats.lowerPositionChange.characterID);
    var lowerPositionChangeServer = generateLink(globalStats.lowerPositionChange.serverName, '/#/ranking/' + globalStats.lowerPositionChange.serverName);
    var lowerPositionChangeStat = globalStats.lowerPositionChange.rankingPositionChange;

    fileTxt += '\n\n### Stats\n\n';

    fileTxt += '**Point scorer of the day**\n';
    fileTxt += '>' + topHPChar + ' from ' + topHPServer + ' ' + ' (' + topHPStat+ ') Honor Points\n\n\n';

    fileTxt += '**Climber of the day**\n';
    fileTxt += '>' + topPositionChangeChar + ' from ' + topPositionChangeServer + ' ' + ' (' + topPositionChangeStat + ') positions\n\n\n';

    fileTxt += '**Worst of the day**\n';
    fileTxt += '>' + lowerPositionChangeChar + ' from ' + lowerPositionChangeServer + ' ' + ' (' + lowerPositionChangeStat + ') positions\n\n\n';

    $log.debug('stats generated');

    grunt.file.write(postsFolder + fileName, fileTxt);

    //Just generate the blog files
    blog.generateBlogFiles();

    function generateLink(txt, link) {
      return '[' + txt + '](' + link + ')';
    }
  }

  //Creates players cheatsheet
  function _createPlayersCheatSheet() {
    $log.debug('Starting to create players cheatSheet');

    var _wholeData = [];

    grunt.file.expand(charactersBaseFolder + '*').forEach(function($$folderName){
      var _serverName = $$folderName.split('/')[3];

      $log.debug('Reading data from >>> %s', colors.cyan(_serverName));

      grunt.file.expand($$folderName + '/*').forEach(function($$characterFileName) {
        var _id = $$characterFileName.split('/')[4].split('.')[0];
        var _data = grunt.file.readJSON($$characterFileName);

        _wholeData.push({
          'id': _id,
          'characterName': _data['characterName'],
          'characterClassID': _data['characterClassID'],
          'characterRaceID': _data['raceID'],
          'characterPosition': _data['position'],
          'characterSoldierRankID': _data['soldierRankID'],
          'serverName': _serverName,
          'lastStatus': _data['status'][_data['status'].length -1]['date']
        });
      });

    });
    _wholeData.sort(function(a, b){
      return a['characterName'].localeCompare(b['characterName']);
    });

    $log.debug('Storing data on %scharactersSheet.json', charactersBaseFolder);

    grunt.file.write(charactersBaseFolder + 'charactersSheet.json', JSON.stringify(_wholeData));

    $log.debug('Storing data on %scharactersSheet.xml', charactersBaseFolder);

    //Change dates on wholeDatas
    _wholeData.forEach(function($$entry){
      var _d = new Date($$entry['lastStatus']);
      $$entry['lastStatus'] = parseInt(_d.getTime()) / 1000;
    });

    grunt.file.write(charactersBaseFolder + 'charactersSheet.xml', o2x({
      '?xml version=\"1.0\" encoding=\"iso-8859-1\"?' : null,
      'characters': {
        'character': _wholeData
      }
    }));
  }

  //Sorsts server files in ascendant way...
  function _sortServerFilesAsc(a, b) {
    var _aSplit = a.split('/')[2].split('-');
    var _bSplit = b.split('/')[2].split('-');

    var _dateA = {
      'day': parseInt(_aSplit[1]),
      'month': parseInt(_aSplit[0]),
      'year': parseInt(_aSplit[2])
    };

    var _dateB = {
      'day': parseInt(_bSplit[1]),
      'month': parseInt(_bSplit[0]),
      'year': parseInt(_bSplit[2])
    };

    if(_dateA['year'] == _dateB['year']) {

      if(_dateA['month'] == _dateB['month']) {
        return _dateA['day'] - _dateB['day'];
      }
      else {
        return _dateA['month'] - _dateB['month'];
      }

    }
    else {
      return _dateA['year'] - _dateB['year'];
    }
  }
};
