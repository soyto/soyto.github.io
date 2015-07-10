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

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = serverData.data.elyos.select(_initCharacter);
      $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);

      $scope.textSearch = '';

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

      $scope.$watch('textSearch', _performSearch);
    }

    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    function _performSearch(text) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function(){
        if(text) {

          $scope.elyosData = serverData.data.elyos.where(function (character) {
            return character.characterName.toLowerCase().indexOf(text.toLowerCase()) >= 0;
          }).select(_initCharacter);

          $scope.asmodianData = serverData.data.asmodians.where(function (character) {
            return character.characterName.toLowerCase().indexOf(text.toLowerCase()) >= 0;
          }).select(_initCharacter);

          $scope.versusData = initialVersusData.where(function(pair){
            return pair.elyo.characterName.toLowerCase().indexOf(text.toLowerCase()) >= 0 || pair.asmodian.characterName.toLowerCase().indexOf(text.toLowerCase()) >= 0;
          });


        } else {
          $scope.elyosData = serverData.data.elyos.select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);
          $scope.versusData = initialVersusData;
        }
      }, 500);
    }
  }

})(angular);