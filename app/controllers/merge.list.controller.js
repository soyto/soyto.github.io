(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serversData', 'groupID', listController
  ]);

  function listController($log, $scope, $location, $timeout, helperService, storedDataService, serversData, groupID) {
    $scope._name = CONTROLLER_NAME;
    var textSearch_timeoutPromise = null;

    //Change server or date Fn
    $scope.goTo = function(serverMerge) {
      //Same data and server, don't do nothing
      if(serverMerge.id == groupID) {
        return;
      }

      $location.path('/merge/' + serverMerge.id);
    };

    _init();

    function _init() {

      var serverNames = serversData.select(function(itm){ return itm.server.name; }).join(' + ');

      helperService.$scope.setTitle(serverNames);
      helperService.$scope.setNav('ranking.list');

      $scope.serverData = {
        data: {
          elyos: [],
          asmodians: [],
        },
        name: serverNames,
        id: groupID
      };

      $scope.mergeGroups = storedDataService.mergeGroups.select(function(group, idx) {
        return {
          id: idx,
          name: group.select(function(itm){ return itm.name; }).join(' + ')
        };
      });
      $scope.currentMerge = $scope.mergeGroups.first(function(itm){ return itm.id == groupID; });
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      serversData.forEach(function(server) {
        $scope.serverData.data.elyos = $scope.serverData.data.elyos.concat(server.data.elyos);
        $scope.serverData.data.asmodians = $scope.serverData.data.asmodians.concat(server.data.asmodians);
      });

      $scope.serverData.data.elyos.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });
      $scope.serverData.data.asmodians.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });

      $scope.serverData.data.elyos.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });
      $scope.serverData.data.asmodians.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });

      $scope.elyosData = $scope.serverData.data.elyos.select(_initCharacter);
      $scope.asmodianData = $scope.serverData.data.asmodians.select(_initCharacter);

      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch(newValue, $scope.selectedClass, $scope.selectedRank);
      });
      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch($scope.textSearch, newValue, $scope.selectedRank);
      });
      $scope.$watch('selectedRank', function(newValue){
        _performFilterAndSearch($scope.textSearch, $scope.selectedClass, newValue);
      });
    }

    //Initializes a character
    function _initCharacter(character) {
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Calculates new rank
    function _calculateNewRank(character) {

      if(character.position == 1) {
        character.soldierRankID = 18;
        return;
      }

      if(character.position <= 3) {
        character.soldierRankID = 17;
        return;
      }

      if(character.position <= 10) {
        character.soldierRankID = 16;
        return;
      }

      if(character.position <= 30) {
        character.soldierRankID = 15;
        return;
      }

      if(character.position <= 100) {
        character.soldierRankID = 14;
        return;
      }

      if(character.position <= 300) {
        character.soldierRankID = 13;
        return;
      }

      if(character.position <= 500) {
        character.soldierRankID = 12;
        return;
      }

      if(character.position <= 700) {
        character.soldierRankID = 11;
        return;
      }

      if(character.position <= 999) {
        character.soldierRankID = 10;
        return;
      }

      character.soldierRankID = 9;

    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        //If not filter is provided
        if(!classToFilter && !textToSearch && !rankToFilter) {
          $scope.elyosData = $scope.serverData.data.elyos.select(_initCharacter);
          $scope.asmodianData = $scope.serverData.data.asmodians.select(_initCharacter);
          return;
        }

        //Filter elyos data
        $scope.elyosData = $scope.serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter);

        //Filter asmodian data
        $scope.asmodianData = $scope.serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter);

      }, 500);

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();
          var serverName = character.serverName ? character.serverName.toLowerCase() : '';

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0 ||
            serverName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        return meetsTxt && meetsClass && meetsRank;
      }
    }
  }

})(angular);
