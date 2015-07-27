(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($scope, $location, $timeout, helperService, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;
    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    _init();

    function _init() {

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);

      $scope.serverData = serverData;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = serverData.data.elyos.select(_initCharacter);
      $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);

      $scope.textSearch = '';
      $scope.selectedClass = '';


      if(serverData.data.elyos.length > serverData.data.asmodians.length) {

        serverData.data.elyos.forEach(function (elyosCharacter) {
          var asmodianCharacter = serverData.data.asmodians.first(function(asmodian){ return asmodian.position == elyosCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: elyosCharacter.position,
            rankName: elyosCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });

      } else if(serverData.data.elyos.length < serverData.data.asmodians.length) {

        serverData.data.asmodians.forEach(function (asmodianCharacter) {
          var elyosCharacter = serverData.data.elyos.first(function(elyos){ return elyos.position == asmodianCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: asmodianCharacter.position,
            rankName: asmodianCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });


      } else if(serverData.data.elyos.length ==  serverData.data.asmodians.length) {
        serverData.data.elyos.forEach(function (elyosCharacter, idx) {
          var asmodianCharacter = serverData.data.asmodians.first(function(asmodian){ return asmodian.position == elyosCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: elyosCharacter.position,
            rankName: elyosCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });
      }

      $scope.versusData = initialVersusData;

      //On date changed
      $scope.$watch('searchDate', function(newValue){
        if(newValue != serverData.date) {
          $location.path('/ranking/' + serverData.serverName + '/' + newValue);
        }
      });

      $scope.$watch('currentServer', function(newValue){
        if(newValue.name != serverData.serverName) {
          $location.path('/ranking/' + newValue.name + '/' + serverData.date);
        }
      });

      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch(newValue, $scope.textSearch);
      });
      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch($scope.selectedClass, newValue);
      });
    }

    //Initializes a character
    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(classToFilter, textToSearch) {

      var filterByName = function(character, txt) {
        return character.characterName && (character.characterName.toLowerCase().indexOf(textToSearch) >= 0 ||
          (character.guildName && character.guildName.toLowerCase().indexOf(textToSearch) >= 0 ));
      };

      var filterByClass = function(character, classToFilter) {
        return character.characterClassID == classToFilter.id;
      };

      var filterAndSearchFn = function(character, txt, classToFilter){
        if(classToFilter && txt) {
          return filterByClass(character, classToFilter) && filterByName(character, txt);
        } else if(classToFilter) {
          return filterByClass(character, classToFilter);
        } else {
          return filterByName(character, txt);
        }
      };

      var filterAndSearchInVersus = function(pair, textToSearch, classToFilter) {

        if(classToFilter && textToSearch) {
          return (pair.elyo && filterByName(pair.elyo, textToSearch) && filterByClass(pair.elyo, classToFilter)) ||
            (pair.asmodian && filterByName(pair.asmodian, textToSearch) && filterByClass(pair.asmodian, classToFilter));
        } else if(classToFilter) {
          return (pair.elyo && filterByClass(pair.elyo, classToFilter)) ||
            (pair.asmodian && filterByClass(pair.asmodian, classToFilter));
        } else {
          return (pair.elyo && filterByName(pair.elyo, textToSearch)) ||
            (pair.asmodian && filterByName(pair.asmodian, textToSearch));
        }
      };

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        if (classToFilter || textToSearch) {
          $scope.elyosData = serverData.data.elyos.where(function(character) {
            return filterAndSearchFn(character, textToSearch, classToFilter);
          }).select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.where(function(character) {
            return filterAndSearchFn(character, textToSearch, classToFilter);
          }).select(_initCharacter);

          $scope.versusData = initialVersusData.where(filterAndSearchInVersus);

        } else {
          $scope.elyosData = serverData.data.elyos.select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);
          $scope.versusData = initialVersusData;
        }

      },500);

    }
  }

})(angular);