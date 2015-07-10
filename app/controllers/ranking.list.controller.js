(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$location', 'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($scope, $location, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;

    _init();

    function _init() {
      $scope.serverData = serverData;
      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = serverData.data.elyos;
      $scope.asmodianData = serverData.data.asmodians;


      $scope.elyosData.select(_initCharacter);
      $scope.asmodianData.select(_initCharacter);


      _fillVersusTable(serverData.data);

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
    }

    function _fillVersusTable(data) {
      $scope.versusData = [];

      data.elyos.forEach(function(elyosCharacter, idx){
        var asmodianCharacter = data.asmodians[idx];

        $scope.versusData.push({
          elyo: _initCharacter(elyosCharacter),
          asmodian: _initCharacter(asmodianCharacter)
        });
      });
    }

    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }
  }

})(angular);