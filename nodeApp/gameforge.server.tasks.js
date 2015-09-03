module.exports = function(grunt) {
  'use strict';

  var gameForgeServer   = require('../nodeApp/gameforge.server');
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
    var userAgent             = config.crawler['user-agent']
    var charactersBaseFolder  = baseFolder + 'Characters/';
    var today                 = moment().format('MM-DD-YYYY');
    var folderName            = baseFolder + today + '/';

    //Here we will store servers data and errors
    var servers = [];
    var serverErrors = [];

    //If folder doesn't exists, just create it
    if(!grunt.file.exists(folderName)) {
      grunt.file.mkdir(folderName);
    }

    //1st step: Perform login
    var sp = gameForgeServer.login(config.crawler.login, config.crawler.password, userAgent);

    //2nd step, retrieve all servers data
    sp = sp.then(function(cookie){
      //just cutted off for limit
      var serversList = gameForgeServer.servers
        .where(function(itm){ return itm.name == 'Calindi' || itm.name == 'Alquima'; });
      return retrieveServersData(cookie, serversList, userAgent).then(function(allServersData){
        servers = allServersData;
      });
    });

    sp = sp.then(function(){
      $log.debug(JSON.stringify(servers.length));
    });


    return;



    sp = sp.then(function(cookie) {
      var $$q = $q.resolve();

      //For each server
      gameForgeServer.servers.where(function(itm){ return itm.name == 'Calindi'; }).forEach(function(server) {

        //Where we will store characters
        var charactersFolder = charactersBaseFolder + server.name + '/';

        if(!grunt.file.exists(charactersFolder)) {
          grunt.file.mkdir(charactersFolder);
        }

        $$q = $$q.then(function() {

          return gameForgeServer.retrieveServer(server.name, server.id, cookie, config.crawler['user-agent'])
            .then(function(currentServerData) {

              //Report that is completed
              $log.debug('Retrieved [%s]', colors.cyan(server.name));

              //If there was an error on the crawler
              if(currentServerData.errors && currentServerData.errors.length > 0) {
                serverErrors.push({
                  server: server,
                  errors: currentServerData.errors
                });
              }

              //Expand serverData with stats
              currentServerData.entries.stats = {
                elyos: {
                  mostHP: null,
                  mostPositions: null,
                  minorPositions: null
                },
                asmodians: {
                  mostHP: null,
                  mostPositions: null,
                  minorPositions: null
                }
              };

              //Retrieve other server files
              var files = grunt.file.expand('data/*/' + server.name + '.json').select(function(fileName) {
                var data = grunt.file.readJSON(fileName);
                return {
                  date : new Date(fileName.split('/')[1]),
                  characters: data.elyos.concat(data.asmodians)
                };
              });

              //Loop found files
              files = files.sort(function(a, b){ return a.date - b.date});

              //Here we will store the characters itselfs
              var storedCharacters = [];

              //Loop files
              files.forEach(function(file){

                //Loop characters stored in the files
                file.characters.forEach(function(character){

                  var storedCharacter = storedCharacters.first(function(char){ return char.characterID == character.characterID});

                  //If character isn't stored, store it now
                  if(!storedCharacter) {

                    storedCharacter = {
                      characterID: character.characterID,
                      characterClassID: character.characterClassID,
                      raceID: character.raceID
                    };

                    storedCharacter.status = [{
                        date: file.date,
                        position: character.position,
                        rankingPositionChange: character.rankingPositionChange,
                        gloryPoint: character.gloryPoint,
                        gloryPointChange: 0,
                        soldierRankID: character.soldierRankID
                    }];

                    storedCharacter.names = [{
                        date: file.date,
                        characterName : character.characterName
                    }];

                    storedCharacter.guilds = [{
                        date: file.date,
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
                      date: file.date,
                      position: character.position,
                      rankingPositionChange: lastStatus.position - character.position,
                      gloryPoint: character.gloryPoint,
                      gloryPointChange: character.gloryPoint - lastStatus.gloryPoint,
                      soldierRankID: character.soldierRankID
                    });

                    //Name changed?
                    if(lastName.characterName != character.characterName) {
                      storedCharacter.names.push({
                        date: file.date,
                        characterName : character.characterName
                      });
                    }
                    //Guild changed?
                    if(lastGuild.guildID != character.guildID) {
                      storedCharacter.guilds.push({
                        date: file.date,
                        guildName: character.guildName,
                        guildID: character.guildID,
                      });
                    }
                  }
                });
              });

              //When we reach here we have all characters stored

              //Loop currentServer characters
              currentServerData.entries.elyos.concat(currentServerData.entries.asmodians)
                .forEach(function(character){

                  //Retrieve the character that we had stored
                  var storedCharacter = storedCharacters.first(function(char){ return char.characterID == character.characterID});

                  //If character isn't stored, store it now
                  if(!storedCharacter) {

                    storedCharacter = {
                      characterID: character.characterID,
                      characterClassID: character.characterClassID,
                      raceID: character.raceID
                    };

                    storedCharacter.status = [{
                        date: today,
                        position: character.position,
                        rankingPositionChange: character.rankingPositionChange,
                        gloryPoint: character.gloryPoint,
                        gloryPointChange: 0,
                        soldierRankID: character.soldierRankID
                    }];

                    storedCharacter.names = [{
                        date: today,
                        characterName : character.characterName
                    }];

                    storedCharacter.guilds = [{
                        date: today,
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

                    //if we have that lastStatus is just today
                    if(lastStatus.date == today) {
                      lastStatus = storedCharacter.status.length > 1
                        ? storedCharacter.status[storedCharacter.status.length - 1]
                        : null;
                    }

                    //We need to update character itself
                    character.rankingPositionChange = lastStatus.position - character.position;
                    character.gloryPointChange = character.gloryPoint - lastStatus.gloryPoint;

                    //Now we must update server tops
                    var stats = character.raceID == 0
                      ? currentServerData.entries.stats.elyos
                      : currentServerData.entries.stats.asmodians;

                    if(!stats.mostHP || character.gloryPointChange > stats.mostHP.gloryPointChange) {
                      stats.mostHP = {
                        characterID : character.characterID,
                        characterName : character.characterName,
                        gloryPointChange : character.gloryPointChange
                      };
                    }

                    if(!stats.mostPositions || character.rankingPositionChange > stats.mostPositions.rankingPositionChange) {
                      stats.mostPositions = {
                        characterID : character.characterID,
                        characterName : character.characterName,
                        rankingPositionChange : character.rankingPositionChange
                      };
                    }

                    if(!stats.minorPositions || character.rankingPositionChange < stats.minorPositions.rankingPositionChange) {
                      stats.minorPositions = {
                        characterID : character.characterID,
                        characterName : character.characterName,
                        rankingPositionChange : character.rankingPositionChange
                      };
                    }

                    //Update characterInfo data
                    storedCharacter.status.push({
                      date: today,
                      position: character.position,
                      rankingPositionChange: lastStatus.position - character.position,
                      gloryPoint: character.gloryPoint,
                      gloryPointChange: character.gloryPoint - lastStatus.gloryPoint,
                      soldierRankID: character.soldierRankID
                    });

                    //Update charaterName
                    if(lastName.characterName != character.characterName) {
                      storedCharacter.names.push({
                        date: today,
                        characterName : character.characterName
                      });
                    }

                    if(lastGuild.guildID != character.guildID) {
                      storedCharacter.guilds.push({
                        date: today,
                        guildName: character.guildName,
                        guildID: character.guildID,
                      });
                    }

                  }
              });

              //Store characters
              //I

              //Store the serverData
              grunt.file.write(folderName + server.name + '.json', JSON.stringify(currentServerData.entries));
            });
        });
      });

      //Return the promise for loop
      return $$q;
    });

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
          .then(function(serverData){
            serversFullData.push(serverData);
        });
      });
    });

    return $$q.then(function(){
      return serversFullData;
    });
  }
};
