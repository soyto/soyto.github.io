(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$marked', 'helperService', 'storedDataService', 'posts', index_controller
  ]);


  function index_controller($scope, $marked, helperService, storedDataService, posts) {
    $scope._name = CONTROLLER_NAME;

    $scope.servers = storedDataService.serversList;
    $scope.lastServerUpdateData = storedDataService.getLastServerData();
    $scope.posts = posts.select(function(post){
      post.htmlContent = $marked(post.content);
      return post;
    });


    helperService.$scope.setTitle('Soyto.github.io');
    helperService.$scope.setNav('home');
  }
})(angular);
