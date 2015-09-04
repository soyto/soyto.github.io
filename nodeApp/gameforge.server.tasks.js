module.exports = function(grunt) {
  'use strict';

  var gameForgeServer   = require('../nodeApp/gameforge.server');
  var blog              = require('../nodeApp/blog');
  var config            = require('../nodeApp/config.js');
  var moment            = require('moment');
  var $log              = require('../nodeApp/log');
  var $q                = require('q');
  var colors            = require('colors');

  require('../lib/javascript.extensions.js');


  //Performs the full crawler
  grunt.registerTask('crawler', function() {
    var done = this.async();

    var baseFolder            = config.application['base-folder'];
    var postsFolder           = config.application['posts-folder'];
    var appFolder            = config.application['app-folder'];
    var userAgent             = config.crawler['user-agent']
    var charactersBaseFolder  = baseFolder + 'Characters/';
    var today                 = moment().format('MM-DD-YYYY');
    var folderName            = baseFolder + today + '/';

    $log.debug(today);

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

    //1st step: Perform login
    var sp = gameForgeServer.login(config.crawler.login, config.crawler.password, userAgent);

    //2nd step, retrieve all servers data
    sp = sp.then(function(cookie){
      //just cutted off for limit
      return retrieveServersData(cookie, gameForgeServer.servers, userAgent).then(function(allServersData){
        servers = allServersData;
      });
    });

    //3d step, check and store errors
    sp = sp.then(function(){
      servers.forEach(function(server) {
        if(server.errors && server.errors.length > 0) {
          crawlerErrors.push({
            serverName : server.serverName,
            serverId: server.serverId,
            errors: server.errors
          });
        }
      });
    });

    //4th step we need to extract players info for each server
    sp = sp.then(function() {
      servers.forEach(function(server) {

        var serverCharactersFolder = charactersBaseFolder + server.serverName + '/';

        //Set date on server
        server.date = new Date(today);

        //Extract previous dates
        var serverPreviousDates = grunt.file.expand('data/*/' + server.serverName + '.json')
          .select(function(fileName) {
            var data = grunt.file.readJSON(fileName);
            return {
              date : new Date(fileName.split('/')[1]),
              characters: data.elyos.concat(data.asmodians)
            };
          })
          .sort(function(a, b){ return a.date - b.date});

        //Retrieve characters array
        var storedCharacters = gameForgeServer.generateCharacterInfo(serverPreviousDates);

        //Update both, storedCharacters and server
        gameForgeServer.updateServerCharacters(storedCharacters, server);

        //Remove all characterInfo files
        grunt.file.expand(serverCharactersFolder + '*').forEach(function(file){
          grunt.file.delete(file);
        });

        //Store characterInfos
        storedCharacters.forEach(function(character){
          $log.debug('Storing [%s:%s] characterInfo', colors.yellow(server.serverName), colors.cyan(character.names[character.names.length - 1].characterName));
          grunt.file.write(serverCharactersFolder + character.characterID + '.json', JSON.stringify(character, null, ' '));
        });
      });
    });

    //5th step, generate server stats
    sp = sp.then(function() {
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
        var serverTopHP = elyosStats.topHP.gloryPointChange > asmodianStats.topHP.gloryPointChange
          ? elyosStats.topHP
          : asmodianStats.topHP;

        var serverTopPositionChange = elyosStats.topPositionChange.rankingPositionChange > asmodianStats.topPositionChange.rankingPositionChange
          ? elyosStats.topPositionChange
          : asmodianStats.topPositionChange;

        var serverLowerPositionChange = elyosStats.lowerPositionChange.rankingPositionChange < asmodianStats.lowerPositionChange.rankingPositionChange
          ? elyosStats.lowerPositionChange
          : asmodianStats.lowerPositionChange;

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

      var serverDates = [];

      servers.forEach(function(server) {
        serverDates.push(moment(server.date).format('MM-DD-YYYY'));
        $log.debug('Storing [%s] server', colors.cyan(server.serverName));
        grunt.file.write(folderName + server.serverName + '.json', JSON.stringify(server.entries));
      });

      //Now store serverDates
      grunt.file.write(appFolder + 'helpers/folders.dates.js', 'window.storedDates = ' + JSON.stringify(serverDates, null, ' ').replace(/"/g, '\'') + ';');
    });

    //7th step, generate blog post
    sp = sp.then(function() {
      var fileName = moment().format('YYYY-MM-DD.HH-mm') + '.' + moment().format('MM-DD-YYYY') + '-data.md';

      var fileTxt = '';

      //First we set up errors if we have some
      if(crawlerErrors.length > 0 ) {
        fileTxt += '### Errors on crawler·\n';
        crawlerErrors.forEach(function(crawlerError) {

          var serverName = generateLink(crawlerError.serverName, '/#/ranking/' + crawlerError.serverName);

          crawlerError.errors.forEach(function(error){

            var faction = error.faction == 0 ? 'elyos' : 'asmoodians'
            var start = (error.pageNum * 50) + 1;
            var end = (error.pageNum + 1) * 50;

            fileTxt += '- ' + serverName + '[' + faction + ': positions ' + start + ' to ' + end + '\n';
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
    });

    //Confirm all
    sp.then(function(){
      done();
    });
  });

  //Will retrieve all servers data
  function retrieveServersData(cookie, serversList, userAgent) {
    var $$q = $q.resolve();

    var serversFullData = [];

    serversList.forEach(function(server){
      $$q = $$q.then(function(){
        return gameForgeServer.retrieveServer(server.name, server.id, cookie, userAgent)
          .then(function(serverData) {

            //Notify that all is succesfully
            $log.debug('Retrieved [%s]', colors.cyan(server.name));

            //Push to the array
            serversFullData.push(serverData);
        });
      });
    });

    return $$q.then(function(){
      return serversFullData;
    });
  }
};
