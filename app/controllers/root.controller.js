(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,['$hs', _fn]);


  function _fn($hs) {

    var $rs = $hs.$instantiate('$rootScope');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var cfpLoadingBar = $hs.$instantiate('cfpLoadingBar');

    $rs['_name'] = CONTROLLER_NAME;

    $rs['$$currentPath'] = $location.path();

    $rs.$on('$routeChangeStart', function(event){
      cfpLoadingBar.start();
      $rs['oggs'] = [];
    });

    $rs.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', {'page': $location.path() });
      $rs['$$currentPath'] = $location.path();
    });
  }

})(angular);