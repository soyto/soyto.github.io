(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,[
    '$rootScope',main_controller
  ]);


  function main_controller($rootScope) {
    $rootScope._name = CONTROLLER_NAME;

  }

})(angular);