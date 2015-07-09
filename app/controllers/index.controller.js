(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'storedDataService', index_controller
  ]);


  function index_controller($scope, storedDataService) {
    $scope._name = CONTROLLER_NAME;
    $scope.servers = storedDataService.serversList;

  }
})(angular);