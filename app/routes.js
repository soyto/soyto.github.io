/* global */
(function(ng){
  'use strict';

  ng.module('mainApp').config(['$routeProvider', '$isMobile', _fn]);

  function _fn($routeProvider, $isMobile) {

    //Index route
    var _indexRouteData = {
      'templateUrl': '/app/templates/index.html',
      'controller': 'mainApp.index.controller',
      'resolve': {
        'posts': ['$hs', function($hs){ return $hs.$instantiate('blogService').getAll(); }]
      }
    };
    $routeProvider.when('/', _indexRouteData);

    //Ranking route
    var rankingRouteData = {
      'templateUrl': '/app/templates/ranking.html',
      'controller': 'mainApp.ranking.list.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getLastFromServer($route['current']['params']['serverName']);
        }]
      }
    };
    var rankingRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getLastFromServer($route['current']['params']['serverName']);
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', $isMobile ? rankingRouteMobileData :  rankingRouteData);

    var rankingWithDateRouteData = {
      'templateUrl': '/app/templates/ranking.html',
      'controller': 'mainApp.ranking.list.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getFromServer(
              $route['current']['params']['date'],
              $route['current']['params']['serverName']);
        }]
      }
    };
    var rankingWithDateRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs.$instantiate('storedDataService').getFromServer(
              $route['current']['params']['date'],
              $route['current']['params']['serverName']);
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', $isMobile ? rankingWithDateRouteMobileData : rankingWithDateRouteData);


    var characterInfoRouteData = {
      'templateUrl': '/app/templates/characterInfo.html',
      'controller': 'mainApp.characterInfo.controller',
      'resolve': {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs.$instantiate('storedDataService').getCharacterInfo(
              $route['current']['params']['serverName'],
              $route['current']['params']['characterID']);
        }]
      }
    };
    var characterInfoMobileRouteData = {
      'templateUrl': '/app/templates/characterInfo.mobile.html',
      'controller': 'mainApp.characterInfo.controller',
      resolve: {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs.$instantiate('storedDataService').getCharacterInfo(
              $route['current']['params']['serverName'],
              $route['current']['params']['characterID']);
        }]
      }
    };
    $routeProvider.when('/character/:serverName/:characterID', $isMobile ? characterInfoMobileRouteData :  characterInfoRouteData);
  }

})(angular);