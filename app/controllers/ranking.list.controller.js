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
      $scope.searchDate = serverData.date;

      _fillVersusTable(serverData.data);

      //On date changed
      $scope.$watch('searchDate', function(newValue){
        if(newValue != serverData.date) {
          $location.path('/ranking/' + serverData.serverName + '/' + newValue);
        }
      });
    }

    function _fillVersusTable(data) {
      $scope.versusData = [];

      data.elyos.forEach(function(elyosCharacter, idx){
        var asmodianCharacter = data.asmodians[idx];
        $scope.versusData.push({
          elyo: elyosCharacter,
          asmodian: asmodianCharacter
        });
      });
    }
  }

})(angular);