(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'storedDataService', 'helperService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, storedDataService, helperService, characterInfo) {
    $scope._name = CONTROLLER_NAME;

    helperService.$scope.setTitle(characterInfo.serverName + ' -> ' + characterInfo.data.names[characterInfo.data.names.length - 1].characterName);

    var dateSortFn = function(a,b) { return a.date > b.date ? -1 : 1; };

    $scope.serverName = characterInfo.serverName;
    $scope.character = characterInfo.data;

    $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyo';
    $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
    $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

    $scope.character.names = $scope.character.names.sort(dateSortFn);
    $scope.character.status = $scope.character.status.sort(dateSortFn);
    $scope.character.guilds = $scope.character.guilds.sort(dateSortFn);

    $scope.character.status.forEach(function(status){
      status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
    });

  }
})(angular);