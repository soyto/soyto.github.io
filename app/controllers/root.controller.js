(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,[
    '$rootScope', '$window', '$location' ,main_controller
  ]);


  function main_controller($rootScope, $window, $location) {
    $rootScope._name = CONTROLLER_NAME;

    $rootScope.$on('$viewContentLoaded', function(event){
      $window.ga('send', 'pageview', { page: $location.path() });
    });

  }

})(angular);