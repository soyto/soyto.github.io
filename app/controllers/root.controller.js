(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,[
    '$rootScope', '$window', '$location', 'cfpLoadingBar', main_controller
  ]);


  function main_controller($rootScope, $window, $location, cfpLoadingBar) {
    $rootScope._name = CONTROLLER_NAME;


    $rootScope.$on('$routeChangeStart', function(){
      cfpLoadingBar.start();
    });

    $rootScope.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', { page: $location.path() });
    });
  }

})(angular);