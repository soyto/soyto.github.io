(function(ng){
  'use strict';

  ng.module('mainApp', []).controller('main.controller', function($scope, $http){
    $scope.title = 'Title setted up with angular';

    $http({
      url: 'data/06-08-2015/Alquima.json',
      method: 'GET'
    }).success(function(data){
      $scope.alquimaData = data;
    });

  });

})(angular);