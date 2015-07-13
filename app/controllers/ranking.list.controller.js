(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$location', '$timeout',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($scope, $location, $timeout, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;
    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    _init();

    function _init() {
      $scope.serverData = serverData;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; })

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = serverData.data.elyos.select(_initCharacter);
      $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);

      $scope.textSearch = '';
      $scope.selectedClass = '';

      serverData.data.elyos.forEach(function(elyosCharacter, idx){
        var asmodianCharacter = serverData.data.asmodians[idx];

        initialVersusData.push({
          elyo: _initCharacter(elyosCharacter),
          asmodian: _initCharacter(asmodianCharacter)
        });
      });

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

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        var filterAndSearchFn = function(character){
          if(classToFilter && textToSearch) {
            return character.characterClassID == classToFilter.id && character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          } else if(classToFilter) {
            return character.characterClassID == classToFilter.id;
          } else {
            return character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          }
        };

        var filterAndSearchInVersus = function(pair) {

          if(classToFilter && textToSearch) {
            return pair.elyo && pair.elyo.characterName &&  pair.elyo.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 && pair.elyo.characterClassID == classToFilter.id ||
              pair.asmodian && pair.asmodian.characterName && pair.asmodian.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 && pair.asmodian.characterClassID == classToFilter.id;
          } else if(classToFilter) {
            return pair.elyo && pair.elyo.characterName && pair.elyo.characterClassID == classToFilter.id || pair.asmodian && pair.asmodian.characterClassID == classToFilter.id
          } else {
            return pair.elyo && pair.elyo.characterName && pair.elyo.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 ||
              pair.asmodian && pair.asmodian.characterName &&  pair.asmodian.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0;
          }
        };

        if (classToFilter || textToSearch) {

          $scope.elyosData = serverData.data.elyos.where(filterAndSearchFn).select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.where(filterAndSearchFn).select(_initCharacter);

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