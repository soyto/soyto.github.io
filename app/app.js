(function(ng){
  'use strict';

  ng.module('mainApp',[
    'ngRoute'
  ]);

  ng.module('mainApp').config(['$routeProvider', configRoutes]);


  function configRoutes($routeProvider) {

    //Index route
    var indexRouteData = {
      templateUrl: '/app/templates/index.html',
      controller: 'mainApp.index.controller',
    };
    $routeProvider.when('/', indexRouteData);

    //Ranking route
    var rankingRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getLastFromServer($route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', rankingRouteData);

    var rankingWithDateRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getFromServer($route.current.params.date, $route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', rankingWithDateRouteData);


    var characterInfoRouteData = {
      templateUrl: '/app/templates/characterInfo.html',
      controller: 'mainApp.characterInfo.controller',
      resolve: {
        characterInfo: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getCharacterInfo($route.current.params.serverName, $route.current.params.characterID));
        }]
      }
    };
    $routeProvider.when('/character/:serverName/:characterID', characterInfoRouteData);
  }


})(angular);