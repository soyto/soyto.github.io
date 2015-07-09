(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'serverData', index_controller
  ]);

  function index_controller($scope, serverData) {
    $scope._name = CONTROLLER_NAME;
    $scope.serverData = serverData;
  }

})(angular);