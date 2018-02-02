/* global moment, marked, jQuery, gapi */
(function(ng, navigator, moment, marked, jQuery, gapi){
  'use strict';

  ng.module('mainApp',[
    'ngRoute',
    'ngSanitize',
    'angular-loading-bar',
    'chart.js',
    'mgcrea.ngStrap',
    'ngAnimate',
  ]);

  ng.module('mainApp')
    .constant('$moment', moment)
    .constant('$marked', marked)
    .constant('jQuery', jQuery)
    .constant('$gapi' , gapi)
    .config(['$routeProvider', configRoutes])
    .config(['cfpLoadingBarProvider', cfpLoadingBarFn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
  var $$IS_MOBILE =  IS_MOBILE_REGEX_1.test(navigator.userAgent) || IS_MOBILE_REGEX_2.test(navigator.userAgent.substr(0,4));

  function configRoutes($routeProvider) {

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
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverName'])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace();  });
        }]
      }
    };
    var rankingRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverName'])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace(); });
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', $$IS_MOBILE ? rankingRouteMobileData :  rankingRouteData);

    var rankingWithDateRouteData = {
      'templateUrl': '/app/templates/ranking.html',
      'controller': 'mainApp.ranking.list.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getFromServer($route['current']['params']['date'], $route['current']['params']['serverName'])
            .catch(function($$error) { $hs.$instantiate('$location').path('/404').replace();  });
        }]
      }
    };
    var rankingWithDateRouteMobileData = {
      'templateUrl': '/app/templates/ranking.mobile.html',
      'controller': 'mainApp.ranking.list.mobile.controller',
      'resolve': {
        'serverData': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getFromServer($route['current']['params']['date'], $route['current']['params']['serverName'])
            .catch(function($$error) { $hs.$instantiate('$location').path('/404').replace();  });
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', $$IS_MOBILE ? rankingWithDateRouteMobileData : rankingWithDateRouteData);

    var characterInfoRouteData = {
      'templateUrl': '/app/templates/characterInfo.html',
      'controller': 'mainApp.characterInfo.controller',
      'resolve': {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs
            .$instantiate('storedDataService')
            .getCharacterInfo($route['current']['params']['serverName'], $route['current']['params']['characterID'])
            .catch(function($$error) { $hs.$instantiate('$location').path('/404').replace(); });
        }]
      }
    };
    var characterInfoMobileRouteData = {
      'templateUrl': '/app/templates/characterInfo.mobile.html',
      'controller': 'mainApp.characterInfo.controller',
      resolve: {
        'characterInfo': ['$hs', '$route', function($hs, $route){
          return $hs
            .$instantiate('storedDataService')
            .getCharacterInfo($route['current']['params']['serverName'], $route['current']['params']['characterID'])
            .catch(function($$error) { $hs.$instantiate('$location').path('/404').replace(); });
        }]
      }
    };
    $routeProvider.when('/character/:serverName/:characterID', $$IS_MOBILE ? characterInfoMobileRouteData :  characterInfoRouteData);

    //Twitch channels
    var twitchChannelsRouteData = {
      'templateUrl': '/app/templates/twitchChannels.html',
      'controller': 'mainApp.twitchChannels.controller',
    };
    $routeProvider.when('/twitchChannels', twitchChannelsRouteData);

    var _luckRouteData = {
      'resolve': {
        'luck': ['$location', 'storedDataService', function($location, storedDataService) {
          storedDataService.getCharacterCheatSheet().then(function($$data) {
            var _itm = $$data[Math.round(Math.random() * $$data.length)];
            $location.path('/character/' + _itm['serverName'] + '/' + _itm['id']);
          });
        }]
      }
    };
    $routeProvider.when('/luck', _luckRouteData);

    //404 route
    var _404RouteData = {
      'templateUrl': '/app/templates/404.html',
    };
    $routeProvider.when('/404', _404RouteData);

  }

  function cfpLoadingBarFn(cfpLoadingBarProvider) {
    cfpLoadingBarProvider['includeSpinner'] = false;
    cfpLoadingBarProvider['includeBar']  = true;
  }

})(angular, navigator, moment, marked, jQuery, gapi);
