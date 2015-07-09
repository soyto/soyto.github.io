(function(ng){
  'use strict';

  ng.module('mainApp', []).controller('main.controller', function($scope){
    $scope.title = 'Title setted up with angular';
  });

})(angular);