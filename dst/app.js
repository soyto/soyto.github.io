/*
 * Soyto.github.io (0.21.11)
 *     DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *         Version 2, December 2004
 * 
 * Copyright (C) 2012 Romain Lespinasse <romain.lespinasse@gmail.com>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 * 
 */
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

    //MERGES!
    var _mergeRouteData = {
      'templateUrl': '/app/templates/merge.html',
      'controller': 'mainApp.merge.list.controller',
      'resolve': {
        'serverData1': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverNames'].split('-')[0])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace();  });
        }],
        'serverData2': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverNames'].split('-')[1])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace();  });
        }]
      }
    };
    var _mergeRouteMobileData = {
      'templateUrl': '/app/templates/merge.mobile.html',
      'controller': 'mainApp.merge.list.mobile.controller',
      'resolve': {
        'serverData1': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverNames'].split('-')[0])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace();  });
        }],
        'serverData2': ['$hs', '$route', function($hs, $route) {
          return $hs
            .$instantiate('storedDataService')
            .getLastFromServer($route['current']['params']['serverNames'].split('-')[1])
            .catch(function($$error) {  $hs.$instantiate('$location').path('/404').replace();  });
        }]
      }
    };
    //$routeProvider.when('/merge/:serverNames', $$IS_MOBILE ? _mergeRouteMobileData :  _mergeRouteData);

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


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$hs', 'characterInfo', index_controller
  ]);


  function index_controller($sc, $hs, characterInfo) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $moment = $hs.$instantiate('$moment');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');

    //Search object
    var _search = {
      'term': '',
      'text': '',
      'results': null,
      'loading': false,
      'selectedIndex': null,
    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        _search['results'] = null;
        _search['selectedIndex'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function () {

        _search['term'] = text;
        _search['loading'] = true;
        _search['selectedIndex'] = null;

        //Google analytics event track
        $window.ga('send', 'event', 'search_event_category', 'characterInfo_onChange_search_action', text);

        return storedDataService.characterSearch(text).then(function ($data) {
          _search['results'] = $data;
          _search['loading'] = false;
        });
      }, 500);
    };

    //When user press a keydown on search panel
    $sc.onKeydown_searchPanel = function($event){

      if(_search['results'] == null || _search['results'].length === 0) {
        return;
      }
      else if(_search['selectedIndex'] === null) { //If we didnt started to navigate...

        //If user pressed on up arrow or down arrow..
        if($event.keyCode == 40 || $event.keyCode == 38) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter go to first result
        if($event.keyCode == 13) {
          var _searchItem = _search['results'][0];
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }
      }
      else { //If user already started the navigation

        //Down arrow without control
        if ($event.keyCode == 40 && !$event.ctrlKey) {
          _search['selectedIndex']++;

          if (_search['selectedIndex'] == _search['results'].length) {
            _search['selectedIndex'] = 0;
          }
          _scrollAndDontBubble();
        }

        //Down arrow with control
        else if ($event.keyCode == 40 && $event.ctrlKey) {
          _search['selectedIndex'] = _search['results'].length - 1;
          _scrollAndDontBubble();
        }

        //Up arrow without control
        else if ($event.keyCode == 38 && !$event.ctrlKey) {
          _search['selectedIndex']--;

          if (_search['selectedIndex'] === -1) {
            _search['selectedIndex'] = _search['results'].length - 1;
          }
          _scrollAndDontBubble();
        }

        //Up arrow with control
        else if ($event.keyCode == 38 && $event.ctrlKey) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter fo to the result
        else if($event.keyCode == 13) {
          /* jshint-W004 */
          var _searchItem = _search['results'][_search['selectedIndex']];
          /* jshint+W004 */
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }

        else {
          $sc.$broadcast('ngScrollTo.scroll', {
            'identifier': 'search-input'
          });
        }
      }

      function _scrollAndDontBubble(){
        $event.stopPropagation();
        $event.preventDefault();
        $sc.$broadcast('ngScrollTo.scroll', {
          'identifier': 'search-result-' + _search['selectedIndex']
        });
      }
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -----------------------------------------------*/

    //Init function
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;

      //Set page title
      $hs.$scope.setTitle([
        characterInfo['serverName'],
        '->',
        characterInfo['characterName']
      ].join(' '));


      $hs['$scope'].setOggs([
        {'property': 'ogg:type', 'content': 'profile'},
        {'property': 'ogg:first_name', 'content': characterInfo['serverName'] + '->' + characterInfo['characterName']},
        {'property': 'ogg:title', 'content': characterInfo['serverName'] + '->' + characterInfo['characterName']},
        {'property': 'ogg:image', 'content': characterInfo['pictureURL']},
        {'property': 'ogg:image:type', 'content': 'image/jpeg'},
        {'property': 'ogg:image:alt', 'content': characterInfo['characterName']},
      ]);

      //Set up character and server names and stats
      $sc['serverName'] = characterInfo['serverName'];
      $sc['character'] = characterInfo;

      //Set up chart
      $sc['chart'] = _setUpChart(characterInfo);

      //Set up pagination
      $sc['pagination'] = _setUpPagination(characterInfo['status'], 10);

      //Search...
      $sc['search'] = _search;
    }

    //Sets up the chart
    function _setUpChart(characterInfo) {

      //If character haven't status dont return nothing
      if(characterInfo['status'].length === 0) {
        return null;
      }

      var _chart = {
        'options': { 'pointHitDetectionRadius' : 4 },
        'labels': [],
        'series': [characterInfo['characterName']],
        'data': [[]]
      };

      //Retrieve last 30 days for chart data
      var _chartData = characterInfo['status'].slice(0, 30);

      _chartData.sort(function(a, b){
        return a['date'].getTime() - b['date'].getTime();
      });

      _chartData.forEach(function($$status){
        _chart['labels'].push($moment($$status['date']).format('MM-DD-YYYY'));
        _chart['data'][0].push($$status['gloryPoint']);
      });

      return _chart;
    }

    //Sets up pagination
    function _setUpPagination(collection, elementsPerPage) {

      var _result = {
        'currentPage': 0,
        'elementsPerPage': elementsPerPage,
        'numPages': parseInt(collection.length / elementsPerPage),
        'collection': collection,
        'current': collection.slice(0, elementsPerPage),
        'pages': [],
        'goTo': function(pageNum) {
          var $$this = this;

          //Outside bounds, dont do nothing
          if(pageNum < 0 || pageNum >= this['numPages'].length) {
            return;
          }

          //Set page num
          this['currentPage'] = pageNum;

          //Clean elements
          this['current'].splice(0, this['current'].length);

          //Calculate start and end index
          var _startIdx = this['currentPage'] * this['elementsPerPage'];
          var _endIdx = _startIdx + this['elementsPerPage'];

          //Append elements
          this['collection'].slice(_startIdx, _endIdx).forEach(function($$element){
            $$this['current'].push($$element);
          });

        },
        'next': function(){
          //If we are on last
          if(this['currentPage'] + 1 >= this['numPages']) { return; }
          this.goTo(this['currentPage'] + 1);
        },
        'prev': function() {
          //If we are on first
          if(this['currentPage'] === 0) { return; }
          this.goTo(this['currentPage'] - 1);
        }
      };

      if(collection.length % elementsPerPage > 0) { _result['numPages']++; }
      if(_result['numPages'] === 0){ _result['numPages'] = 1; }

      for(var i = 0; i < _result['numPages']; i++) {
        _result['pages'].push(i);
      }

      return _result;
    }
  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', 'posts', _fn]);

  function _fn($sc, $hs, $posts) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');

    var _wholePosts = null;

    //Search object
    var _search = {
      'term': '',
      'text': '',
      'results': null,
      'loading': false,
      'selectedIndex': null,
    };

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        _search['results'] = null;
        _search['selectedIndex'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function(){

        _search['term'] = text;
        _search['loading'] = true;
        _search['selectedIndex'] = null;

        //Google analytics event track
        $window.ga('send', 'event', 'search_event_category', 'index_search_action', text);

        return storedDataService.characterSearch(text).then(function($data){
          _search['results'] = $data;
          _search['loading'] = false;
        });
      }, 500);
    };

    //When user press a keydown on search panel
    $sc.onKeydown_searchPanel = function($event){

      if(_search['results'] == null || _search['results'].length === 0) {
        return;
      }
      else if(_search['selectedIndex'] === null) { //If we didnt started to navigate...

        //If user pressed on up arrow or down arrow..
        if($event.keyCode == 40 || $event.keyCode == 38) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter go to first result
        if($event.keyCode == 13) {
          var _searchItem = _search['results'][0];
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }
      }
      else { //If user already started the navigation

        //Down arrow without control
        if ($event.keyCode == 40 && !$event.ctrlKey) {
          _search['selectedIndex']++;

          if (_search['selectedIndex'] == _search['results'].length) {
            _search['selectedIndex'] = 0;
          }
          _scrollAndDontBubble();
        }

        //Down arrow with control
        else if ($event.keyCode == 40 && $event.ctrlKey) {
          _search['selectedIndex'] = _search['results'].length - 1;
          _scrollAndDontBubble();
        }

        //Up arrow without control
        else if ($event.keyCode == 38 && !$event.ctrlKey) {
          _search['selectedIndex']--;

          if (_search['selectedIndex'] === -1) {
            _search['selectedIndex'] = _search['results'].length - 1;
          }
          _scrollAndDontBubble();
        }

        //Up arrow with control
        else if ($event.keyCode == 38 && $event.ctrlKey) {
          _search['selectedIndex'] = 0;
          _scrollAndDontBubble();
        }

        //If user press enter fo to the result
        else if($event.keyCode == 13) {
          /* jshint-W004 */
          var _searchItem = _search['results'][_search['selectedIndex']];
          /* jshint+W004 */
          $location.url('/character/' + _searchItem['serverName'] + '/' + _searchItem['id']);
        }

        else {
          $sc.$broadcast('ngScrollTo.scroll', {
            'identifier': 'search-input'
          });
        }
      }

      function _scrollAndDontBubble(){
        $event.stopPropagation();
        $event.preventDefault();
        $sc.$broadcast('ngScrollTo.scroll', {
          'identifier': 'search-result-' + _search['selectedIndex']
        });
      }
    };

    //Shows more posts
    $sc.showMorePosts = function(qty) {
      var _startingIdx = $sc['posts'].length;
      $sc['posts'] = $sc['posts'].concat(_wholePosts.slice(_startingIdx, _startingIdx + qty));
    };

    /*--------------------------------------------  PRIVATE FUNCTIONS  -----------------------------------------------*/

    //Init Fn
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;

      $sc['servers'] = storedDataService.serversList;
      $sc['lastServerUpdateData'] = storedDataService.getLastServerData();

      _wholePosts = $posts;
      _wholePosts.forEach(function($$post){
        $$post['htmlContent'] = $marked($$post['content']);
      });

      $sc['posts'] = _wholePosts.slice(0, 1);
      $sc['posts_count'] = _wholePosts.length;

      $sc['search'] = _search;

      $hs.$scope.setTitle('Soyto.github.io');
      $hs.$scope.setNav('home');
    }

  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$hs', 'serverData', _fn
  ]);

  function _fn($sc, $hs, serverData) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $location = $hs.$instantiate('$location');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $timeout = $hs.$instantiate('$timeout');

    var _data = {
      'date': null,
      'serverName': null,
      'asmodians': [],
      'elyos': [],
      'versus': [],
      'stats': null,
      'filter': {
        'text': '',
        'class': null,
        'rank': null,
        'all_classess': [],
        'all_ranks': [],
      },
      'navigation': {
        'servers': [],
        'dates': [],
        'lastDate': null,
        'server': null,
        'date': null,
      },
      'pagination': {
        'currentPage': 0,
        'numElementsPerPage': 100,
        'numPages': null,
        'numElements': null,
        'pageNumbers': [],
        'current': {
          'versus': [],
          'elyos': [],
          'asmodians': []
        }
      },
      'chart': {
        'num_elements': 10,
        'options': {
          'responsive': true,
          'maintainAspectRatio': false
        },
        'labels': [],
        'series': ['Elyos', 'Asmodians'],
        'data': [[],[]],
        'colors': ['#DD66DD', '#97BBCD'],
      },
      '$$state': {
        'activeView': 'versus',
        'versusData': [],
        'serverData': serverData,
      }
    };

    //Call to init Fn
    _init();

    /* -------------------------------- SCOPE FUNCTINS --------------------------------------------------- */

    //Change server or date Fn
    $sc.onClick_navigateTo = function() {

      var _navigation = _data['navigation'];

      //Same server, dont do nothing
      if (_navigation['date'] == _data['date'] && _navigation['serverName'] == _data['serverName']) { return; }


      var _url = _navigation['date'] == _data['navigation']['lastDate'] ?
        '/ranking/' + _navigation['server']['name'] :
        '/ranking/' + _navigation['server']['name'] + '/' + _navigation['date'];

      $location.path(_url);
    };

    //Changes current view
    $sc.onClick_changeView = function(viewName) {
      _data['$$state']['activeView'] = viewName;
    };

    //On click on pagination change
    $sc.onClick_paginationChange = function(page) {
      var _pagination = _data['pagination'];

      if(page < 0) { return; }
      if(page > _pagination['numPages'] - 1) { return; }
      if(page == _pagination['currentPage']) { return; }

      _pagination['currentPage'] = page;
      _pagination_setPageData();
    };

    //On change class
    $sc.onChange_class = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    //On change rank
    $sc.onChange_rank = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    //On change text
    $sc.onChange_text = function() {
      $q.timeTrigger('filter', _performFilter, 1500);
    };

    //On click on filter
    $sc.onClick_filter = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    /* -------------------------------- PRIVATE FUNCTINS --------------------------------------------------- */

    //Initialization Fn
    function _init() {

      //Set name on scope
      $sc['_name'] = CONTROLLER_NAME;

      //Set title and navigation
      $hs['$scope'].setTitle(serverData['serverName'] + ' -> ' + serverData['date']);
      $hs['$scope'].setNav('ranking.list');

      $sc['data'] = _data;

      //Initialize serverData
      _initialize_versusData();
      _initialize_serverData();
      _initialize_navigation();
      _initialize_chartData();

      _initialize_pagination();

      _data['filter']['all_classess'] = storedDataService['characterClassIds'].where(function(itm){ return itm.id; });
      _data['filter']['all_ranks'] = storedDataService['characterSoldierRankIds']
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });
    }

    //Initializes versus data
    function _initialize_versusData() {
      for(var i = 0; i < 1000; i++) {
        _data['$$state']['versusData'].push({
          'position': i + 1,
          'elyo': _initCharacter(serverData['data']['elyos'][i]),
          'asmodian': _initCharacter(serverData['data']['asmodians'][i])
        });
      }
    }

    //Initializes sever data
    function _initialize_serverData() {
      _data['date'] = serverData['date'];
      _data['serverName'] = serverData['serverName'];
      _data['asmodians'] = serverData['data']['asmodians'].select(_initCharacter());
      _data['elyos'] = serverData['data']['elyos'].select(_initCharacter());
      _data['versus'] = ng.copy(_data['$$state']['versusData']);
      _data['stats'] = serverData['data']['stats'];
    }

    //Initialize navigation data
    function _initialize_navigation() {

      _data['navigation']['dates'] = storedDataService['storedDates'];
      _data['navigation']['servers'] = storedDataService['serversList'];

      _data['navigation']['lastDate'] = _data['navigation']['dates'][_data['navigation']['dates'].length - 1];
      _data['navigation']['date'] = _data['date'];
      _data['navigation']['server'] = _data['navigation']['servers'].first(function(x){ return x['name'] == _data['serverName']; });
    }

    //Initializes chart data
    function _initialize_chartData() {

      var _chart = _data['chart'];

      var _step = Math.floor(1000 / _chart['num_elements']);

      for(var i = 0; i <= _chart['num_elements']; i++) {
        var _position = 1000 - i * _step;

        if(_position === 0) { _position = 1; }
        if(i === 0) { _position = 999; }

        /* jshint-W083 */
        var _elyosCharacter = _data['elyos'].first(function(x){ return x['position'] == _position; });
        var _asmodianCharacter = _data['asmodians'].first(function(x){ return x['position'] == _position; });
        /* jshint+W083 */

        _chart['labels'].push(_position);
        _chart['data'][0].push(_elyosCharacter ? _elyosCharacter['gloryPoint']: 0);
        _chart['data'][1].push(_asmodianCharacter ? _asmodianCharacter['gloryPoint']: 0);
      }
    }

    //Initialize pagination
    function _initialize_pagination() {
      var _pagination = _data['pagination'];

      _pagination['numElements'] = Math.max(_data['elyos'].length, _data['asmodians'].length);
      _pagination['numPages'] = Math.floor(_pagination['numElements'] / _pagination['numElementsPerPage']);
      _pagination['numPages'] += _pagination['numElements'] % _pagination['numElementsPerPage'] > 0 ? 1 : 0;
      _pagination['pageNumbers'] = Array.apply(null, {'length': _pagination['numPages']}).map(function(current, idx){ return idx + 1; }, Number);

      //Set current page
      _pagination_setPageData();
    }

    //Sets pagination page date
    function _pagination_setPageData() {
      var _pagination = _data['pagination'];

      var _startIdx = _pagination['currentPage'] * _pagination['numElementsPerPage'];

      _pagination['current']['elyos'].empty().pushAll(_data['elyos'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
      _pagination['current']['asmodians'].empty().pushAll(_data['asmodians'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
      _pagination['current']['versus'].empty().pushAll(_data['versus'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
    }

    //Initializes a character
    function _initCharacter(character) {

      if(!character) { return {}; }
      character['characterClass'] = storedDataService.getCharacterClass(character['characterClassID']);
      character['soldierRank'] = storedDataService.getCharacterRank(character['soldierRankID']);

      return character;
    }

    //Performs a filter
    function _performFilter() {

      var _textFilter = _data['filter']['text'];
      var _rankFilter = _data['filter']['rank'];
      var _classFilter = _data['filter']['class'];


      //If no filter is provided
      if(!_textFilter && !_rankFilter && !_classFilter) {
        _data['asmodians'] = serverData['data']['asmodians'].select(_initCharacter());
        _data['elyos'] = serverData['data']['elyos'].select(_initCharacter());
        _data['versus'] = ng.copy(_data['$$state']['versusData']);

        _initialize_pagination();
        _pagination_setPageData();
      }
      else {
        _data['asmodians'] = serverData['data']['asmodians'].where(filterCharacter).select(_initCharacter());
        _data['elyos'] = serverData['data']['elyos'].where(filterCharacter).select(_initCharacter());
        _data['versus'] = ng.copy(_data['$$state']['versusData']).where(function(x){
          return filterCharacter(x['elyo']) || filterCharacter(x['asmodian']);
        });

        _initialize_pagination();
        _pagination_setPageData();
      }

      //Filters a character...
      function filterCharacter(character) {
        var _meetsTxt = false;
        var _meetsClass = false;
        var _meetsRank = false;

        //If character is null, its false!
        if(!character || !character['characterName']){ return false; }

        if(!_textFilter) {_meetsTxt = true; }
        else {

          var searchTxt = _textFilter.toLowerCase();

          var charName = character['characterName'] ? character['characterName'].toLowerCase() : '';
          var guildName = character['guildName'] ? character['guildName'].toLowerCase() : '';

          var characterClassName = storedDataService.getCharacterClass(character['characterClassID'])['name'].toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character['soldierRankID'])['name'].toLowerCase();

          _meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!_classFilter) {
          _meetsClass = true;
        }
        else if(character)  {
          _meetsClass = character['characterClassID'] == _classFilter['id'];
        }

        if(!_rankFilter) {
          _meetsRank = true;
        }
        else if(character) {
          _meetsRank = character['soldierRankID'] == _rankFilter['id'];
        }

        return _meetsTxt && _meetsClass && _meetsRank;
      }

    }
  }
})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$window', '$location', 'storedDataService', 'helperService', 'serverData', index_controller
  ]);

  function index_controller($scope, $window, $location, storedDataService, helperService, serverData) {
    $scope._name = CONTROLLER_NAME;

    $scope.filteredData = false;

    $scope.filter = {
      'textSearch': null,
      'selectedClass': null,
      'selectedRank': null
    };

    $scope.page = {};
    $scope.page.elyos = {};
    $scope.page.asmodians = {};

    _init();

    //Change server or date Fn
    $scope.goTo = function(server, serverDate) {
      //Same data and server, don't do nothing
      if(server.name == serverData.serverName && serverDate == serverData.date) {
        return;
      }

      $location.path('/ranking/' + server.name + '/' + serverDate);

    };

    $scope.page.elyos.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.elyos.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.elyos.numPages) {
          $scope.pagination.elyos.currentPage = value - 1;
          $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
        }

      }
    };

    $scope.page.elyos.next = function(){

      if($scope.pagination.elyos.currentPage + 1 >= $scope.pagination.elyos.numPages) { return; }

      $scope.pagination.elyos.currentPage += 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.elyos.previous = function(){

      if($scope.pagination.elyos.currentPage === 0) { return; }

      $scope.pagination.elyos.currentPage -= 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.asmodians.next = function(){

      if($scope.pagination.asmodians.currentPage + 1 >= $scope.pagination.asmodians.numPages) { return; }

      $scope.pagination.asmodians.currentPage += 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.previous = function(){

      if($scope.pagination.asmodians.currentPage === 0) { return; }

      $scope.pagination.asmodians.currentPage -= 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.asmodians.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.asmodians.numPages) {
          $scope.pagination.asmodians.currentPage = value - 1;
          $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
        }

      }
    };

    //Performs search
    $scope.search = function(){
      _performFilterAndSearch($scope.filter.textSearch, $scope.filter.selectedClass, $scope.filter.selectedRank);
    };

    $scope.clear = function(){
      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = '';
      _performFilterAndSearch('', null, null);

      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = null;
      $scope.filter.selectedRank = null;
    };

    function _init() {

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);
      helperService.$scope.setNav('ranking.list');

      $scope.pagination = {
        elyos: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        },
        asmodians: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        }
      };

      $scope.serverData = serverData;

      //Is server data empty?
      $scope['isEmpty'] = serverData['data']['asmodians'].length === 0 && serverData['data']['elyos'].length === 0;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = '';


      $scope.filters = {};
      $scope.filters.show = false;
    }

    //Initializes a character
    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      //Reset pagination
      $scope.pagination.elyos.currentPage = 0;
      $scope.pagination.asmodians.currentPage = 0;

      var paginateElyos = function(data) {
        return _performPagination(data, $scope.pagination.elyos);
      };
      var paginateAsmodians = function(data) {
        return _performPagination(data, $scope.pagination.asmodians);
      };

      //If not filter is provided
      if(!classToFilter && !textToSearch && !rankToFilter) {
        $scope.elyosData = paginateElyos(serverData.data.elyos.select(_initCharacter));
        $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.select(_initCharacter));
        $scope.filteredData = false;
        return;
      }

      //Filter elyos data
      $scope.elyosData = paginateElyos(serverData.data.elyos.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filter asmodian data
      $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        $scope.filteredData = true;
        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Performs pagination on page
    function _performPagination(elements, pagination) {

      var idx = pagination.currentPage * pagination.numElementsPerPage;

      pagination.numElements = elements.length;
      pagination.elements = elements;

      pagination.numPages = parseInt(elements.length / pagination.numElementsPerPage);

      if(elements.length % pagination.numElementsPerPage > 0) { pagination.numPages += 1; }
      if(pagination.numPages === 0){ pagination.numPages = 1; }

      var result =  elements.slice(idx, pagination.numElementsPerPage + idx);
      return result;
    }
  }

})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$hs', 'serverData1', 'serverData2', _fn
  ]);

  function _fn($sc, $hs, serverData1, serverData2) {
    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $location = $hs.$instantiate('$location');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $timeout = $hs.$instantiate('$timeout');

    var serverData = null;

    var _data = {
      'date': null,
      'serverName': null,
      'asmodians': [],
      'elyos': [],
      'versus': [],
      'stats': null,
      'filter': {
        'text': '',
        'class': null,
        'rank': null,
        'all_classess': [],
        'all_ranks': [],
      },
      'navigation': {
        'servers': [],
        'dates': [],
        'lastDate': null,
        'server': null,
        'date': null,
      },
      'pagination': {
        'currentPage': 0,
        'numElementsPerPage': 100,
        'numPages': null,
        'numElements': null,
        'pageNumbers': [],
        'current': {
          'versus': [],
          'elyos': [],
          'asmodians': []
        }
      },
      'chart': {
        'num_elements': 10,
        'options': {
          'responsive': true,
          'maintainAspectRatio': false
        },
        'labels': [],
        'series': ['Elyos', 'Asmodians'],
        'data': [[],[]],
        'colors': ['#DD66DD', '#97BBCD'],
      },
      '$$state': {
        'activeView': 'versus',
        'versusData': [],
        'serverData': serverData,
        'serverData1': serverData1,
        'serverData2': serverData2
      }
    };

    //Call to init Fn
    _init();

    /* -------------------------------- SCOPE FUNCTINS --------------------------------------------------- */

    //Change server or date Fn
    $sc.onClick_navigateTo = function() {

      var _navigation = _data['navigation'];

      //Same server, dont do nothing
      if (_navigation['date'] == _data['date'] && _navigation['serverName'] == _data['serverName']) { return; }


      var _url = _navigation['date'] == _data['navigation']['lastDate'] ?
        '/ranking/' + _navigation['server']['name'] :
        '/ranking/' + _navigation['server']['name'] + '/' + _navigation['date'];

      $location.path(_url);
    };

    //Changes current view
    $sc.onClick_changeView = function(viewName) {
      _data['$$state']['activeView'] = viewName;
    };

    //On click on pagination change
    $sc.onClick_paginationChange = function(page) {
      var _pagination = _data['pagination'];

      if(page < 0) { return; }
      if(page > _pagination['numPages'] - 1) { return; }
      if(page == _pagination['currentPage']) { return; }

      _pagination['currentPage'] = page;
      _pagination_setPageData();
    };

    //On change class
    $sc.onChange_class = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    //On change rank
    $sc.onChange_rank = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    //On change text
    $sc.onChange_text = function() {
      $q.timeTrigger('filter', _performFilter, 1500);
    };

    //On click on filter
    $sc.onClick_filter = function() {
      $q.timeTrigger('filter', _performFilter, 1);
    };

    /* -------------------------------- PRIVATE FUNCTINS --------------------------------------------------- */

    //Initialization Fn
    function _init() {

      //Set name on scope
      $sc['_name'] = CONTROLLER_NAME;

      _initServerData();

      //Set title and navigation
      $hs['$scope'].setTitle(serverData1['serverName'] + ' + ' + serverData2['serverName'] + ' -> ' + serverData['date']);
      $hs['$scope'].setNav('ranking.list');

      $sc['data'] = _data;


      //Initialize serverData
      _initialize_versusData();
      _initialize_serverData();
      _initialize_navigation();
      _initialize_chartData();

      _initialize_pagination();

      _data['filter']['all_classess'] = storedDataService['characterClassIds'].where(function(itm){ return itm.id; });
      _data['filter']['all_ranks'] = storedDataService['characterSoldierRankIds']
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });
    }

    //Init server data
    function _initServerData() {

      serverData = {
        'serverName': serverData1['serverName'] + ' + ' + serverData2['serverName'],
        'date': serverData1['date'],
        'data': {
          'asmodians': [].concat(serverData1['data']['asmodians'], serverData2['data']['asmodians']),
          'elyos': [].concat(serverData1['data']['elyos'], serverData2['data']['elyos']),
        }
      };

      serverData['data']['asmodians'].sort(function(a, b) { return b['gloryPoint'] - a['gloryPoint']; });
      serverData['data']['elyos'].sort(function(a, b) { return b['gloryPoint'] - a['gloryPoint']; });

      serverData['data']['asmodians'].splice(1000);
      serverData['data']['elyos'].splice(1000);

      //Set up positions in order
      serverData['data']['asmodians'].forEach(function($$character, idx) {
        var _character = ng.copy($$character);
        var _oldPosition = _character['position'];


        _character['position'] = idx + 1;
        _character['rankingPositionChange'] = _oldPosition - _character['position'];
        _character['newSoldierRank'] = storedDataService.getCharacterRankByPosition(_character['position']);

        serverData['data']['asmodians'][idx] = _character;
      });

      //Set up positions in order
      serverData['data']['elyos'].forEach(function($$character, idx) {
        var _character = ng.copy($$character);
        var _oldPosition = $$character['position'];

        _character['position'] = idx + 1;
        _character['rankingPositionChange'] = _oldPosition - _character['position'];
        _character['newSoldierRank'] = storedDataService.getCharacterRankByPosition(_character['position']);

        serverData['data']['elyos'][idx] = _character;
      });

      _data['$$state']['serverData'] = serverData;
    }

    //Initializes versus data
    function _initialize_versusData() {
      for(var i = 0; i < 1000; i++) {
        _data['$$state']['versusData'].push({
          'position': i + 1,
          'elyo': _initCharacter(serverData['data']['elyos'][i]),
          'asmodian': _initCharacter(serverData['data']['asmodians'][i])
        });
      }
    }

    //Initializes sever data
    function _initialize_serverData() {
      _data['date'] = serverData['date'];
      _data['serverName'] = serverData['serverName'];
      _data['asmodians'] = serverData['data']['asmodians'].select(_initCharacter());
      _data['elyos'] = serverData['data']['elyos'].select(_initCharacter());
      _data['versus'] = ng.copy(_data['$$state']['versusData']);
      _data['stats'] = serverData['data']['stats'];
    }

    //Initialize navigation data
    function _initialize_navigation() {

      _data['navigation']['dates'] = storedDataService['storedDates'];
      _data['navigation']['servers'] = storedDataService['serversList'];

      _data['navigation']['lastDate'] = _data['navigation']['dates'][_data['navigation']['dates'].length - 1];
      _data['navigation']['date'] = _data['date'];
      _data['navigation']['server'] = _data['navigation']['servers'].first(function(x){ return x['name'] == _data['serverName']; });
    }

    //Initializes chart data
    function _initialize_chartData() {

      var _chart = _data['chart'];

      var _step = Math.floor(1000 / _chart['num_elements']);

      for(var i = 0; i <= _chart['num_elements']; i++) {
        var _position = 1000 - i * _step;

        if(_position === 0) { _position = 1; }
        if(i === 0) { _position = 999; }

        /* jshint-W083 */
        var _elyosCharacter = _data['elyos'].first(function(x){ return x['position'] == _position; });
        var _asmodianCharacter = _data['asmodians'].first(function(x){ return x['position'] == _position; });
        /* jshint+W083 */

        _chart['labels'].push(_position);
        _chart['data'][0].push(_elyosCharacter ? _elyosCharacter['gloryPoint']: 0);
        _chart['data'][1].push(_asmodianCharacter ? _asmodianCharacter['gloryPoint']: 0);
      }
    }

    //Initialize pagination
    function _initialize_pagination() {
      var _pagination = _data['pagination'];

      _pagination['numElements'] = Math.max(_data['elyos'].length, _data['asmodians'].length);
      _pagination['numPages'] = Math.floor(_pagination['numElements'] / _pagination['numElementsPerPage']);
      _pagination['numPages'] += _pagination['numElements'] % _pagination['numElementsPerPage'] > 0 ? 1 : 0;
      _pagination['pageNumbers'] = Array.apply(null, {'length': _pagination['numPages']}).map(function(current, idx){ return idx + 1; }, Number);

      //Set current page
      _pagination_setPageData();
    }

    //Sets pagination page date
    function _pagination_setPageData() {
      var _pagination = _data['pagination'];

      var _startIdx = _pagination['currentPage'] * _pagination['numElementsPerPage'];

      _pagination['current']['elyos'].empty().pushAll(_data['elyos'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
      _pagination['current']['asmodians'].empty().pushAll(_data['asmodians'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
      _pagination['current']['versus'].empty().pushAll(_data['versus'].slice(_startIdx, _startIdx + _pagination['numElementsPerPage']));
    }

    //Initializes a character
    function _initCharacter(character) {

      if(!character) { return {}; }
      character['characterClass'] = storedDataService.getCharacterClass(character['characterClassID']);
      character['soldierRank'] = storedDataService.getCharacterRank(character['soldierRankID']);

      return character;
    }

    //Performs a filter
    function _performFilter() {

      var _textFilter = _data['filter']['text'];
      var _rankFilter = _data['filter']['rank'];
      var _classFilter = _data['filter']['class'];


      //If no filter is provided
      if(!_textFilter && !_rankFilter && !_classFilter) {
        _data['asmodians'] = serverData['data']['asmodians'].select(_initCharacter());
        _data['elyos'] = serverData['data']['elyos'].select(_initCharacter());
        _data['versus'] = ng.copy(_data['$$state']['versusData']);

        _initialize_pagination();
        _pagination_setPageData();
      }
      else {
        _data['asmodians'] = serverData['data']['asmodians'].where(filterCharacter).select(_initCharacter());
        _data['elyos'] = serverData['data']['elyos'].where(filterCharacter).select(_initCharacter());
        _data['versus'] = ng.copy(_data['$$state']['versusData']).where(function(x){
          return filterCharacter(x['elyo']) || filterCharacter(x['asmodian']);
        });

        _initialize_pagination();
        _pagination_setPageData();
      }

      //Filters a character...
      function filterCharacter(character) {
        var _meetsTxt = false;
        var _meetsClass = false;
        var _meetsRank = false;

        //If character is null, its false!
        if(!character || !character['characterName']){ return false; }

        if(!_textFilter) {_meetsTxt = true; }
        else {

          var searchTxt = _textFilter.toLowerCase();

          var charName = character['characterName'] ? character['characterName'].toLowerCase() : '';
          var guildName = character['guildName'] ? character['guildName'].toLowerCase() : '';

          var characterClassName = storedDataService.getCharacterClass(character['characterClassID'])['name'].toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character['soldierRankID'])['name'].toLowerCase();

          _meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!_classFilter) {
          _meetsClass = true;
        }
        else if(character)  {
          _meetsClass = character['characterClassID'] == _classFilter['id'];
        }

        if(!_rankFilter) {
          _meetsRank = true;
        }
        else if(character) {
          _meetsRank = character['soldierRankID'] == _rankFilter['id'];
        }

        return _meetsTxt && _meetsClass && _meetsRank;
      }

    }
  }
})(angular);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$window', '$location', 'storedDataService', 'helperService', 'serverData1', 'serverData2', index_controller
  ]);

  function index_controller($scope, $window, $location, storedDataService, helperService, serverData1, serverData2) {
    var serverData = null;

    $scope._name = CONTROLLER_NAME;

    $scope.filteredData = false;

    $scope.filter = {
      'textSearch': null,
      'selectedClass': null,
      'selectedRank': null,
    };

    $scope.page = {};
    $scope.page.elyos = {};
    $scope.page.asmodians = {};

    _init();

    //Change server or date Fn
    $scope.goTo = function(server, serverDate) {
      //Same data and server, don't do nothing
      if(server.name == serverData.serverName && serverDate == serverData.date) {
        return;
      }

      $location.path('/ranking/' + server.name + '/' + serverDate);

    };

    $scope.page.elyos.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.elyos.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.elyos.numPages) {
          $scope.pagination.elyos.currentPage = value - 1;
          $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
        }

      }
    };

    $scope.page.elyos.next = function(){

      if($scope.pagination.elyos.currentPage + 1 >= $scope.pagination.elyos.numPages) { return; }

      $scope.pagination.elyos.currentPage += 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.elyos.previous = function(){

      if($scope.pagination.elyos.currentPage === 0) { return; }

      $scope.pagination.elyos.currentPage -= 1;

      $scope.elyosData = _performPagination($scope.pagination.elyos.elements, $scope.pagination.elyos);
    };

    $scope.page.asmodians.next = function(){

      if($scope.pagination.asmodians.currentPage + 1 >= $scope.pagination.asmodians.numPages) { return; }

      $scope.pagination.asmodians.currentPage += 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.previous = function(){

      if($scope.pagination.asmodians.currentPage === 0) { return; }

      $scope.pagination.asmodians.currentPage -= 1;

      $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
    };

    $scope.page.asmodians.goTo = function(){
      var value = $window.prompt('page', $scope.pagination.asmodians.currentPage + 1);

      if(value && !isNaN(value)) {
        value = parseInt(value);

        if(value && value > 0 && value <= $scope.pagination.asmodians.numPages) {
          $scope.pagination.asmodians.currentPage = value - 1;
          $scope.asmodianData = _performPagination($scope.pagination.asmodians.elements, $scope.pagination.asmodians);
        }

      }
    };

    //Performs search
    $scope.search = function(){
      _performFilterAndSearch($scope.filter.textSearch, $scope.filter.selectedClass, $scope.filter.selectedRank);
    };

    $scope.clear = function(){
      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = '';
      _performFilterAndSearch('', null, null);

      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = null;
      $scope.filter.selectedRank = null;
    };

    function _init() {

      _initServerData();

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);
      helperService.$scope.setNav('ranking.list');

      $scope.pagination = {
        elyos: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        },
        asmodians: {
          currentPage: 0,
          numElementsPerPage: 50,
          numPages: -1,
          numElements: -1
        }
      };

      $scope.serverData = serverData;
      $scope.serverData1 = serverData1;
      $scope.serverData2 = serverData2;

      //Is server data empty?
      $scope['isEmpty'] = serverData['data']['asmodians'].length === 0 && serverData['data']['elyos'].length === 0;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

      $scope.filter.textSearch = '';
      $scope.filter.selectedClass = '';


      $scope.filters = {};
      $scope.filters.show = false;
    }

    //Init server data
    function _initServerData() {

      serverData = {
        'serverName': serverData1['serverName'] + ' + ' + serverData2['serverName'],
        'date': serverData1['date'],
        'data': {
          'asmodians': [].concat(serverData1['data']['asmodians'], serverData2['data']['asmodians']),
          'elyos': [].concat(serverData1['data']['elyos'], serverData2['data']['elyos']),
        }
      };


      serverData['data']['asmodians'].sort(function(a, b) { return b['gloryPoint'] - a['gloryPoint']; });
      serverData['data']['elyos'].sort(function(a, b) { return b['gloryPoint'] - a['gloryPoint']; });

      serverData['data']['asmodians'].splice(1000);
      serverData['data']['elyos'].splice(1000);

      //Set up positions in order
      serverData['data']['asmodians'].forEach(function($$character, idx) {
        var _character = ng.copy($$character);
        var _oldPosition = _character['position'];


        _character['position'] = idx + 1;
        _character['rankingPositionChange'] = _oldPosition - _character['position'];
        _character['newSoldierRank'] = storedDataService.getCharacterRankByPosition(_character['position']);

        serverData['data']['asmodians'][idx] = _character;
      });

      //Set up positions in order
      serverData['data']['elyos'].forEach(function($$character, idx) {
        var _character = ng.copy($$character);
        var _oldPosition = $$character['position'];

        _character['position'] = idx + 1;
        _character['rankingPositionChange'] = _oldPosition - _character['position'];
        _character['newSoldierRank'] = storedDataService.getCharacterRankByPosition(_character['position']);

        serverData['data']['elyos'][idx] = _character;
      });
    }

    //Initializes a character
    function _initCharacter(character){
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      //Reset pagination
      $scope.pagination.elyos.currentPage = 0;
      $scope.pagination.asmodians.currentPage = 0;

      var paginateElyos = function(data) {
        return _performPagination(data, $scope.pagination.elyos);
      };
      var paginateAsmodians = function(data) {
        return _performPagination(data, $scope.pagination.asmodians);
      };

      //If not filter is provided
      if(!classToFilter && !textToSearch && !rankToFilter) {
        $scope.elyosData = paginateElyos(serverData.data.elyos.select(_initCharacter));
        $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.select(_initCharacter));
        $scope.filteredData = false;
        return;
      }

      //Filter elyos data
      $scope.elyosData = paginateElyos(serverData.data.elyos.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filter asmodian data
      $scope.asmodianData = paginateAsmodians(serverData.data.asmodians.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0;
        }

        if(!classToFilter) {
          meetsClass = true;
        }
        else if(character)  {
          meetsClass = character.characterClassID == classToFilter.id;
        }

        if(!rankToFilter) {
          meetsRank = true;
        }
        else if(character) {
          meetsRank = character.soldierRankID == rankToFilter.id;
        }

        $scope.filteredData = true;
        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Performs pagination on page
    function _performPagination(elements, pagination) {

      var idx = pagination.currentPage * pagination.numElementsPerPage;

      pagination.numElements = elements.length;
      pagination.elements = elements;

      pagination.numPages = parseInt(elements.length / pagination.numElementsPerPage);

      if(elements.length % pagination.numElementsPerPage > 0) { pagination.numPages += 1; }
      if(pagination.numPages === 0){ pagination.numPages = 1; }

      var result =  elements.slice(idx, pagination.numElementsPerPage + idx);
      return result;
    }
  }

})(angular);


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

(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'mainApp.twitchChannels.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var characterSocialService = $hs.$instantiate('characterSocialService');
    var twitchService = $hs.$instantiate('twitchService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var $interval = $hs.$instantiate('$interval');

    var _streamInterval;

    var _data = {
      'streams': [],
      '$$state': {
        'loading': true
      }
    };


    _init();

    /* --------------------------------- SCOPE FUNCTIONS -----------------------------------------------------------  */


    /* --------------------------------- PRIVATE FUNCTIONS ---------------------------------------------------------  */

    //Initialize
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      $hs.$scope.setTitle('Soyto.github.io | Twitch channels');
      $hs.$scope.setNav('twitchChannels');

      characterSocialService.getGithubSocialData().then(function($$data) {

        $$data['characterSocial']
          .where(function(x){ return x['buttons']['twitch'] != null; })
          .forEach(function(x) { _data['streams'].push({
            'character': x,
            'info': null,
            'channel_id': null,
            'channel': null,
            'stream': null,
            'isOnline': false
          }); });


        _setUpStreams().then(function(){
          _data['$$state']['loading'] = false;
        });
      });

    }

    //Set up the streams
    function _setUpStreams() {

      var _$q = $q.resolve();

      //First of all, update channels
      _$q = _$q.then(function() {
        var _$$qs = [];

        _data['streams'].forEach(function($$stream) {
          _$$qs.push(twitchService.getChannel($$stream['character']['buttons']['twitch'].split('/')[3])
            .then(function($$twitchChannel) {
              $$stream['channel'] = $$twitchChannel;
              $$stream['channel_id'] = $$twitchChannel['_id'];

              return storedDataService.getCharacterInfo(
                $$stream['character']['serverName'],
                $$stream['character']['characterID']).then(function($$characterInfo) {
                $$stream['info'] = $$characterInfo;
              });

            }).catch(function($$error) {
              _data['streams'].remove($$stream);
            })
          );
        });

        return $q.all(_$$qs);
      });

      _$q = _$q.then(function() {

        var _twitchChannelIDs = _data['streams']
          .select(function(x){ return x['character']['buttons']['twitch'].split('/')[3]; });

        //Try to know who is online
        return twitchService.getOnlinePeople(_twitchChannelIDs).then(function($$twitchStreams) {

          $$twitchStreams['streams'].forEach(function($$twitchStream) {
            var _streamItm = _data['streams'].first(function(x){ return x['channel_id'] == $$twitchStream['channel']['_id']; });
            _streamItm['channel'] = $$twitchStream['channel'];
            _streamItm['stream'] = $$twitchStream;
            _streamItm['isOnline'] = true;
          });


          //Sort people
          _data['streams'].sort(function(a, b) {

            if(a['isOnline'] && !b['isOnline']){ return -1; }
            if(!a['isOnline'] && b['isOnline']){ return 1; }

            return a['info']['characterName'].localeCompare(b['info']['characterName']);
          });

        });

      });

      return _$q;
    }

    /* --------------------------------- EVENTS FUNCTIONS ----------------------------------------------------------  */

  }
})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').directive('fbCommentPlugin', ['$window', function($window)  {
    function createHTML(href, numposts, colorscheme) {
      return '<div class="fb-comments" ' +
        'data-href="' + href + '" ' +
        'data-numposts="' + numposts + '" ' +
        'data-colorsheme="' + colorscheme + '">' +
        '</div>';
    }
    return {
      'restrict': 'A',
      'scope': {},
      'link': function postLink(scope, elem, attrs) {
        attrs.$observe('pageHref', function (newValue) {
          var href        = newValue;
          var numposts    = attrs.numposts    || 5;
          var colorscheme = attrs.colorscheme || 'light';

          elem.html(createHTML(href, numposts, colorscheme));

          if($window.FB) {
            $window.FB.XFBML.parse(elem[0]);
          }
        });
      }
    };
  }]);

})(angular);


(function(ng){
  'use strict';

  ng.module('mainApp').directive('ngFbLike', ['$window', function($window)  {


    function _linkFn($sc, $element, $attr) {

      $attr.$observe('pageHref', function (newValue) {
        var _href  = newValue;
        var _layout = $attr['layout'] || 'standard';
        var _action = $attr['action'] || 'like';
        var _showFaces = $attr['showFaces'] || true;

        var _html = _createHTML(_href, _layout, _action, _showFaces);

        $element.empty().append(jQuery(_html));



        if($window.FB) {
          $window.FB.XFBML.parse($element[0]);
        }
      });
    }

    function _createHTML(href, layout, action, showFaces) {
      return '<div class="fb-like" ' +
        'data-href="' + href + '" ' +
        'data-layout="' + layout + '" ' +
        'data-action="' + action + '"' +
        'data-width="100px"' +
        'data-show-faces="' + showFaces + '"></div>';
    }


    return {
      'restrict': 'A',
      'scope': {},
      'link':  _linkFn
    };
  }]);

})(angular);


(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'ngScrollTo';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {


    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $window = $hs.$instantiate('$window');
    var jQuery = $hs.$instantiate('jQuery');

    function _linkFn($sc, $element, $attr) {

      var _identifier = $attr[DIRECTIVE_NAME];
      var _jElement = jQuery($element);


      $sc.$on(DIRECTIVE_NAME + '.scroll', function(evt, args){

        //Dont same identifier, dont do nothing
        if(typeof(args) == 'string' && args !== _identifier) { return; }
        else if(args['identifier'] !== _identifier){ return; }


        var _parentData = null;
        var _parentElement = null;

        if($attr['parentScroll'] === undefined) {
          _parentElement = jQuery($window.document.body);
          _parentData = {
            'offsetTop': Math.round($window.document.body.offsetTop),
            'scrollTop': Math.round($window.document.body.scrollTop),
            'height': Math.round($window.innerHeight),
            'window': null,
          };
          _parentData['window'] = _parentData['scrollTop'] + _parentData['height'];
        }
        else {
          _parentElement = jQuery.parents($attr['parentScroll']);
          _parentData = {
            'offsetTop': Math.round(_parentElement.offset()['top']),
            'scrollTop': Math.round(_parentElement.scrollTop()),
            'height': Math.round(_parentElement.height()),
            'window': null,
          };
          _parentData['window'] = _parentData['scrollTop'] + _parentData['height'];
        }

        var _elementData = {
          'offsetTop': Math.round(_jElement.offset()['top']),
          'height': Math.round(_jElement.height()),
          'window': null,
          'margin': {
            'top': 0,
            'bottom': 0
          }
        };
        _elementData['window'] = _elementData['offsetTop'] + _elementData['height'];

        if($attr['ngScrollToElementMargin'] !== undefined) {
          var _margin = $sc.$eval($attr['ngScrollToElementMargin']);

          _elementData['margin']['top'] = parseInt(_margin['top']);
          _elementData['margin']['bottom'] = parseInt(_margin['bottom']);
        }

        var _isTopShown1 = _parentData['scrollTop'] <= _elementData['offsetTop'] - _elementData['margin']['top'];
        var _isTopShown2 = _parentData['window'] > _elementData['offsetTop'];
        var _isBottomShown1 = _parentData['scrollTop'] <= _elementData['window'] - _elementData['margin']['top'];
        var _isBottomShown2 = _parentData['window'] > _elementData['window'];

        var _isTopShown = _isTopShown1 && _isTopShown2;
        var _isBottomShown = _isBottomShown1 && _isBottomShown2;
        var _isHeightBiggerThanParent = _parentData['height'] < _elementData['height'];

        var _scrollTop = null;

        //If element is smaller than parent height and we cannot see top or bottom: then we must scroll
        if(!_isHeightBiggerThanParent && (!_isTopShown || !_isBottomShown)) {
          _scrollTop = _scrollToNearest(_parentData, _elementData, parseInt($attr['ngScrollToOffset']));
        }
        else if(_isHeightBiggerThanParent && (!_isTopShown || !_isBottomShown)){
          _scrollTop = _scrollToTop(_elementData);
        }
        else {
          return;
        }


        _parentElement.animate({
          'scrollTop': _scrollTop,
        }, 100, 'swing');
      });


      //Scrolls to top of element
      function _scrollToTop(elementData) {
        return elementData['scrollTop'];
      }

      //Scroll to nearest (Top or bottom)
      function _scrollToNearest(parentData, elementData, offset) {
        var _scrollResult = null;

        //If element is in bottom of scroll
        if(parentData['scrollTop'] < elementData['offsetTop'] - elementData['margin']['top']) {
          _scrollResult = elementData['offsetTop'] - parentData['height'] + elementData['height'] + offset + elementData['margin']['bottom'];
        }
        else { //If is on top
          _scrollResult = elementData['offsetTop'] - offset - elementData['margin']['top'];
        }

        if(_scrollResult < 0) {
          _scrollResult = 0;
        }

        return _scrollResult;
      }
    }


    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }


})(angular);

(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'twitchPanel';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var twitchService = $hs.$instantiate('twitchService');
    var $interval = $hs.$instantiate('$interval');

    function _linkFn($sc, $element, $attr) {

      $sc['isLoading'] = true;
      $sc['streamData'] = null;
      $sc['isVisible'] = true;

      var _twitchId = $sc['twitchChannel'].split('/');
      _twitchId = _twitchId[_twitchId.length - 1];

      //Retrieve channel info
      twitchService.getChannel(_twitchId).then(function($$channelData){
        $sc['channelData'] = $$channelData;
      }).then(function(){
        twitchService.getStream(_twitchId).then(function($$stream){
          $sc['channelStream'] = $$stream['stream'];
          $sc['isLoading'] = false;
        });
      }).catch(function() {
        $sc['isVisible'] = false;
      });


      //Check channelStream each minute
      var _interval = $interval(function(){
        twitchService.getStream(_twitchId).then(function($$stream){
          $sc['channelStream'] = $$stream['stream'];
        });
      }, 60 * 1000);

      //If scope is going to be destroyed
      $sc.$on('$destroy', function(){
        $interval.cancel(_interval);
      });
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'twitchChannel': '=twitchChannel'
      },
      'templateUrl': '/app/templates/directives/twitchPanel.html'
    };
  }

})(angular);

(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'youtubePanel';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $interval = $hs.$instantiate('$interval');
    var $youtubeService = $hs.$instantiate('youtubeService');

    function _linkFn($sc, $element, $attr) {

      var _data = {
        'channel': null,
        'videos': [],
        '$$state': {
          'loading': false,
          'visible': false
        }
      };

      $sc['data'] = _data;
      _loadData();



      //Loads data
      function _loadData() {
        var _youtubeChannel = $sc['youtubeChannel'];

        if(_youtubeChannel.indexOf('user/') > 0) {

          _data['$$state']['visible'] = true;
          _data['$$state']['loading'] = true;

          var _username = _youtubeChannel.substr(_youtubeChannel.indexOf('user/') + 5);
          $youtubeService.getChannelFromUser(_username).then(function($$channel) {

            if($$channel == null) { _data['$$state']['visible'] = false; }

            _data['channel'] = _transformChannel($$channel);
            $youtubeService.getLastVideosFromChannel($$channel['id']).then(function($$data) {
              _data['videos'] = $$data.map(_transformVideo);
              _data['$$state']['loading'] = false;
            });
          });
        }
        else if(_youtubeChannel.indexOf('channel/') > 0) {

          _data['$$state']['visible'] = true;
          _data['$$state']['loading'] = true;

          var _channelId = _youtubeChannel.substr(_youtubeChannel.indexOf('channel/') + 8);

          $youtubeService.getChannelFromId(_channelId).then(function($$channel) {

            if($$channel == null) { _data['$$state']['visible'] = false; }

            _data['channel'] = _transformChannel($$channel);
            $youtubeService.getLastVideosFromChannel($$channel['id']).then(function($$data) {
              _data['videos'] = $$data.map(_transformVideo);
              _data['$$state']['loading'] = false;
            });
          });
        }
      }

      function _transformChannel(channel) {
        channel['url'] = 'https://www.youtube.com/channel/' + channel.id;
        return channel;
      }

      function _transformVideo(video) {
        video['url'] = 'https://www.youtube.com/watch?v=' + video.id.videoId;
        video['date'] = new Date(video['snippet']['publishedAt']);
        return video;
      }
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'youtubeChannel': '=youtubeChannel'
      },
      'templateUrl': '/app/templates/directives/youtubePanel.html'
    };
  }

})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('blogService', [
    '$hs', _fn
  ]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $q = $hs.$q;

    var $this = this;

    var _cachedPosts = null;

    //Retrieves all posts
    $this.getAll = function() {
      if(_cachedPosts !== null) {
        return $q.resolve(_cachedPosts);
      }
      else {
        return $q.likeNormal($http({
          'url': 'data/Posts/posts.json',
          'method': 'GET'
        })).then(function($data) {

          $data = $data.sort(function(a, b) {
            return (new Date(b['date'])).getTime() - (new Date(a['date'])).getTime();
          });

          _cachedPosts = $data;
          return $data;
        });
      }
    };
  }
})(angular);


(function(ng){
  'use strict';

  ng.module('mainApp').service('characterSocialService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $this = this;

    var _characterSocialCache = null;

    //Retrieve all github social data
    $this.getGithubSocialData = function() {
      return _retrieveGithubServerData();
    };

    //Sets character Social data on a character
    $this.setCharacterSocialData = function(character) {
      return _retrieveGithubServerData().then(function($$characterSocials){
        character['social'] = {};

        //Set pic
        var _characterPic = _searchCharacter($$characterSocials['characterPics'], 'pic', character);
        if(_characterPic) {
          character['pictureURL'] = _characterPic;
        }
        else {
          character['pictureURL'] = '//placehold.it/450X300/DD66DD/EE77EE/?text=' + character['characterName'];
        }

        character['social'] = _searchCharacter($$characterSocials['characterSocial'], 'buttons', character);

        return character;
      });
    };

    //Retrieves githubServerData
    function _retrieveGithubServerData() {

      if(_characterSocialCache !== null) {
        return $q.resolve(_characterSocialCache);
      }

      var _result = {
        'characterPics': null,
        'characterSocial': null
      };

      return $q.likeNormal($http.get('/app/data/characterPics.json')).then(function($characterPics){
        _result['characterPics'] = $characterPics;
        return $q.likeNormal($http.get('/app/data/characterSocial.json')).then(function($characterSocial){
          _result['characterSocial'] = $characterSocial;

          _characterSocialCache = _result;
          return _result;
        });
      });
    }

    //Searchs on a collection for a propName item
    function _searchCharacter(collection, propName, character) {
      var _$$first = collection.first(function($$item){
        return $$item['serverName'] == character['serverName'] && $$item['characterID'] == character['characterID'];
      });

      if(_$$first) {
        return _$$first[propName];
      }
      else {
        return null;
      }
    }

  }

})(angular);


(function(ng){
	'use strict';

	ng.module('mainApp').service('consoleService',[
		'$window', '$q', 'helperService', 'storedDataService', consoleService
	]);


	function consoleService($window, $q, helperService, storedDataService) {

		var $this = this;
		$window.soyto = $this;


		//Expose $q
		$this.$q = $q;

		//Expose whole service
		$this.storedDataService = storedDataService;


	}
})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('helperService', ['$injector', _fn]);
  ng.module('mainApp').service('$hs', ['$injector', _fn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

  function _fn($injector) {

    var $log = $injector.get('$log');
    var $q = $injector.get('$q');
    var $rs = $injector.get('$rootScope');
    var $window = $injector.get('$window');

    var $this = this;

    //Instantiates a dependency
    $this.$instantiate = function(name) {
      return $injector.get(name);
    };

    //Sort dates
    //NOTE: Review this method
    $this.sortDates = function(dates) {

      dates = dates.sort(function(a, b) {

        var _a = a.split('-');
        var _b = b.split('-');

        _a = [
          parseInt(_a[2]),
          parseInt(_a[0]),
          parseInt(_a[1]),
        ];

        _b = [
          parseInt(_b[2]),
          parseInt(_b[0]),
          parseInt(_b[1]),
        ];


        if(_a[0] > _b[0]) { return 1; }
        if(_a[0] < _b[0]) { return -1; }

        if(_a[1] > _b[1]) { return 1; }
        if(_a[1] < _b[1]) { return -1; }

        if(_a[2] > _b[2]) { return 1; }
        if(_a[2] < _b[2]) { return -1; }


        return 0;
      });

      return dates;
    };

    $this.$scope = {
      'setTitle': function(value){ $rs.title = value; },
      'setNav': function(menu){ $rs.navMenu = menu; },
      'setOggs': function(oggs) { $rs['oggs'] = oggs; }
    };

    $this.navigator = {
      'isMobile': function(){
        return IS_MOBILE_REGEX_1.test($window.navigator.userAgent) || IS_MOBILE_REGEX_2.test($window.navigator.userAgent.substr(0,4));
      }
    };

    $this.$q = $injector.get('helperService.$q').$setParent($this).$q;
  }

})(angular);


(function(ng){
  'use strict';

  var DEBUG = false;

  var host = DEBUG ? '' : 'https://soyto.tk/';

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $timeout = $hs.$instantiate('$timeout');
    var characterSocialService = $hs.$instantiate('characterSocialService');
    var $location = $hs.$instantiate('$location');

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];
    var _cacheCharacterCheatSheet = null;

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;

    var $this = this;

    //who asked to remove his name
    $this.removeOldNames_requests = [
      {'serverName': 'Hellion', 'characterID': 430586}, //Daxking
      {'serverName': 'Deyla', 'characterID': 825556}, //Nyle
      {'serverName': 'Urtem', 'characterID': 1508483}, //Nacka
      {'serverName': 'Hellion', 'characterID': 495423}, //Chetitos
      {'serverName': 'Hyperion', 'characterID': 11600}, //Raynee
      {'serverName': 'Antriksha', 'characterID': 863503}, //Nukey
      {'serverName': 'Antriksha', 'characterID': 642109}, //Yost
      {'serverName': 'Hyperion', 'characterID': 783863}, //Siith
      {'serverName': 'Hellion', 'characterID': 428540}, //Kerberos
      {'serverName': 'Barus', 'characterID': 396287}, //Seyune
      {'serverName': 'Barus', 'characterID': 916298}, //CiuCiuu,
      {'serverName': 'Hyperion', 'characterID': 377330}, //Balonna,
      {'serverName': 'Urtem', 'characterID': 1125512}, //Mipha
      {'serverName': 'Hyperion', 'characterID': 57501},
      {'serverName': 'Loki', 'characterID': 70525}, //Gshee
      {'serverName': 'Deyla', 'characterID': 953168}, //Sylrel
      {'serverName': 'Thor', 'characterID': 1369119}, //Necarunerk
      {'serverName': 'Thor', 'characterID': 1225673}, //Gvnr
      {'serverName': 'Hellion', 'characterID': 612759}, //OjV
      {'serverName': 'Thor', 'characterID': 1369978}, //Sprtmster
      {'serverName': 'Barus', 'characterID': 87465}, //Naki
      {'serverName': 'Loki', 'characterID': 1187322}, //Psyxc
      {'serverName': 'Hellion', 'characterID': 442918}, // Kenae
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Antriksha', 'characterID': 723417}, //Riyuko
      {'serverName': 'Deyla', 'characterID': 1161433}, //Pyirra
      {'serverName': 'Hyperion', 'characterID': 525356}, //Akirawoofametsu
      {'serverName': 'Hellion', 'characterID': 305832}, //Yukasuna
      {'serverName': 'Thor', 'characterID': 1946026}, //Instantflashulti
      {'serverName': 'Thor', 'characterID': 1391505}, //Kiyumah
      {'serverName': 'Deyla', 'characterID': 98839}, //Pupper
      {'serverName': 'Hyperion', 'characterID': 375208}, //Nllll
      {'serverName': 'Barus', 'characterID': 1097587}, //Szarienka 
      {'serverName': 'Loki', 'characterID': 877197}, //Iethal
      {'serverName': 'Antriksha', 'characterID': 920308}, //Myllle
      {'serverName': 'Thor', 'characterID': 2113411}, //Topu
      {'serverName': 'Barus', 'characterID': 9880}, //Flaami
      {'serverName': 'Loki', 'characterID': 1187322}, //Flaami
      {'serverName': 'Hyperion', 'characterID': 857011}, //Nyraaa
      {'serverName': 'Hellion', 'characterID': 457520}, //Xamphu
      {'serverName': 'Loki', 'characterID': 1065721}, //Liinxx
      {'serverName': 'Barus', 'characterID': 822324}, //Dissney
      {'serverName': 'Barus', 'characterID': 1182084}, //Sachma
      {'serverName': 'Antriksha', 'characterID': 696706}, //Nahiki
      {'serverName': 'Loki', 'characterID': 560318}, //Zoai
      {'serverName': 'Barus', 'characterID': 1135327}, //Yorru
      {'serverName': 'Hellion', 'characterID': 584003}, //Guindillera
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Thor', 'characterID': 1135085}, //Auyo
      {'serverName': 'Thor', 'characterID': 1133502}, //Danawhite
      {'serverName': 'Loki', 'characterID': 1065721}, //Futanari
      {'serverName': 'Loki', 'characterID': 536681}, //Nuarihyon
      {'serverName': 'Grendal', 'characterID': 1028}, //Sorcerer
      {'serverName': 'Thor', 'characterID': 2163276}, //Majolie
      {'serverName': 'Thor', 'characterID': 1946026}, //Cremathorio
      {'serverName': 'Hyperion', 'characterID': 392962}, //Upset
      {'serverName': 'Hellion', 'characterID': 1478289}, //Charioce
      {'serverName': 'Deyla', 'characterID': 1163409}, //Gunzblazing
      {'serverName': 'Barus', 'characterID': 332731}, //Akonen
      {'serverName': 'Hyperion', 'characterID': 693206}, //Sistinefibel
      {'serverName': 'Hellion', 'characterID': 427449}, //Qmg
      {'serverName': 'Antriksha', 'characterID': 607628}, //Yukaii
      {'serverName': 'Barus', 'characterID': 58925}, //Yoruchichan
      {'serverName': 'Barus', 'characterID': 710123}, //Minasii
      {'serverName': 'Loki', 'characterID': 713632}, //Zenoya
      {'serverName': 'Thor', 'characterID': 1998102}, //KMI
      {'serverName': 'Barus', 'characterID': 1115780}, //Acidheal
      {'serverName': 'Loki', 'characterID': 567177}, //Hardstylelife
      {'serverName': 'Miren', 'characterID': 40582}, //Heavypanda
      {'serverName': 'Grendal', 'characterID': 70897}, //Qtp
      {'serverName': 'Miren', 'characterID': 3390}, //Pikachu
      {'serverName': 'Hyperion', 'characterID': 672128}, //Eishu
      {'serverName': 'Deyla', 'characterID': 1639577}, //Chntr
      {'serverName': 'Barus', 'characterID': 1157147}, //Meoooow
      {'serverName': 'Barus', 'characterID': 515694}, //Litleshevo 
      {'serverName': 'Loki', 'characterID': 1213346}, //Deqx old name hide
      {'serverName': 'Barus', 'characterID': 1189738}, //Looksi
    ];

    //Who asked to remove his old guild names
    $this.removeOldGuildNames_requests = [
      {'serverName': 'Hellion', 'characterID': 495423}, //Chetitos
      {'serverName': 'Deyla', 'characterID': 1266763}, //Kaijur
      {'serverName': 'Hyperion', 'characterID': 11600}, //Raynee
      {'serverName': 'Antriksha', 'characterID': 863503}, //Nukey
      {'serverName': 'Hyperion', 'characterID': 783863}, //Siith,
      {'serverName': 'Hellion', 'characterID': 428540}, //Kerberos
      {'serverName': 'Barus', 'characterID': 396287}, //Seyune
      {'serverName': 'Barus', 'characterID': 916298}, //CiuCiuu
      {'serverName': 'Hellion', 'characterID': 612759}, //Turbonugget
      {'serverName': 'Hellion', 'characterID': 499099}, //Pepatheinquin
      {'serverName': 'Urtem', 'characterID': 1125512}, //Mipha
      {'serverName': 'Hyperion', 'characterID': 57501},
      {'serverName': 'Loki', 'characterID': 70525}, //Gshee
      {'serverName': 'Thor', 'characterID': 1369119}, //Necarunerk
      {'serverName': 'Hellion', 'characterID': 612759}, //OjV
      {'serverName': 'Thor', 'characterID': 1225673}, //Gvnr
      {'serverName': 'Thor', 'characterID': 1369978}, //Sprtmster
      {'serverName': 'Barus', 'characterID': 87465}, //Naki
      {'serverName': 'Hellion', 'characterID': 442918}, // Kenae
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Antriksha', 'characterID': 723417}, //Riyuko
      {'serverName': 'Deyla', 'characterID': 1161433}, //Pyirra
      {'serverName': 'Hyperion', 'characterID': 525356}, //Akirawoofametsu
      {'serverName': 'Hellion', 'characterID': 305832}, //Yukasuna
      {'serverName': 'Thor', 'characterID': 1946026}, //Instantflashulti
      {'serverName': 'Deyla', 'characterID': 953168}, //Sylrel
      {'serverName': 'Hyperion', 'characterID': 375208}, //Nllll
      {'serverName': 'Loki', 'characterID': 877197}, //Iethal
      {'serverName': 'Antriksha', 'characterID': 920308}, //Myllle
      {'serverName': 'Thor', 'characterID': 2113411}, //Topu
      {'serverName': 'Loki', 'characterID': 1187322}, //Justmoe
      {'serverName': 'Hyperion', 'characterID': 857011}, //Nyraaa
      {'serverName': 'Hellion', 'characterID': 457520}, //Xamphu
      {'serverName': 'Grendal', 'characterID': 1028}, //Sorcerer
      {'serverName': 'Loki', 'characterID': 1065721}, //Liinxx
      {'serverName': 'Barus', 'characterID': 822324}, //Dissney
      {'serverName': 'Barus', 'characterID': 1182084}, //Sachma
      {'serverName': 'Loki', 'characterID': 560318}, //Zoai
      {'serverName': 'Barus', 'characterID': 1135327}, //Yorru
      {'serverName': 'Hellion', 'characterID': 584003}, //Guindillera
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Thor', 'characterID': 1135085}, //Auyo
      {'serverName': 'Thor', 'characterID': 1133502}, //Danawhite
      {'serverName': 'Loki', 'characterID': 1065721}, //Futanari
      {'serverName': 'Loki', 'characterID': 536681}, //Nuarihyon
      {'serverName': 'Hyperion', 'characterID': 392962}, //Upset
      {'serverName': 'Barus', 'characterID': 56391}, //Sicarius
      {'serverName': 'Hellion', 'characterID': 1478289}, //Charioce
      {'serverName': 'Barus', 'characterID': 332731}, //Akonen
      {'serverName': 'Hellion', 'characterID': 427449}, //Qmg
      {'serverName': 'Barus', 'characterID': 58925}, //Yoruchichan
      {'serverName': 'Barus', 'characterID': 710123}, //Minasii
      {'serverName': 'Loki', 'characterID': 713632}, //Zenoya
      {'serverName': 'Thor', 'characterID': 1998102}, //KMI
      {'serverName': 'Thor', 'characterID': 1712628}, //Itsami
      {'serverName': 'Barus', 'characterID': 1115780}, //Acidheal
      {'serverName': 'Loki', 'characterID': 567177}, //Hardstylelife
      {'serverName': 'Miren', 'characterID': 40582}, //Heavypanda
      {'serverName': 'Grendal', 'characterID': 70897}, //Qtp
      {'serverName': 'Miren', 'characterID': 3390}, //Pikachu
      {'serverName': 'Hyperion', 'characterID': 724510}, //Uchiwasasuke
      {'serverName': 'Deyla', 'characterID': 1640322}, //Danawhite
      {'serverName': 'Hyperion', 'characterID': 672128}, //Eishu 
      {'serverName': 'Deyla', 'characterID': 1639577}, //Chntr
      {'serverName': 'Barus', 'characterID': 1157147}, //Meoooow
      {'serverName': 'Barus', 'characterID': 515694}, //Litleshevo 
      {'serverName': 'Hyperion', 'characterID': 724296}, //Rezus
      {'serverName': 'Loki', 'characterID': 1213346}, //Deqx old legion name hide
      {'serverName': 'Barus', 'characterID': 1189738}, //Looksi
    ];

    //Wich servers
    $this.serversList = [
      {'id': 53, 'name': 'Antriksha'},    //0
      {'id': 49, 'name': 'Barus'},        //1
      {'id': 52, 'name': 'Deyla'},        //2
      {'id': 54, 'name': 'Hellion'},      //3
      {'id': 55, 'name': 'Hyperion'},     //4
      {'id': 50, 'name': 'Loki'},         //5
      {'id': 37, 'name': 'Thor'},         //6
      {'id': 40, 'name': 'Urtem'},        //7
      //{'id': 56, 'name': 'Grendal'},      //8
      //{'id': 57, 'name': 'Fregion'},      //9
      //{'id': 58, 'name': 'Padmarashka'},  //10
      //{'id': 59, 'name': 'Miren'},        //11
    ];

    //Wich dates we have stored
    $this.storedDates = $hs.sortDates($window.storedDates);

    //Character soldier ranks
    $this.characterSoldierRankIds = [
      { id: 0, name: 'Soldier Rank 10'},
      { id: 1, name: 'Soldier Rank 9'},
      { id: 2, name: 'Soldier Rank 8'},
      { id: 3, name: 'Soldier Rank 7'},
      { id: 4, name: 'Soldier Rank 6'},
      { id: 5, name: 'Soldier Rank 5'},
      { id: 6, name: 'Soldier Rank 4'},
      { id: 6, name: 'Soldier Rank 3'},
      { id: 7, name: 'Soldier Rank 2'},
      { id: 9, name: 'Soldier Rank 1'},
      { id: 10, name: 'Army 1-Star Officer'},   //Pos 701->1000
      { id: 11, name: 'Army 2-Star Officer'},   //Pos 501->700
      { id: 12, name: 'Army 3-Star Officer'},   //Pos 301->500
      { id: 13, name: 'Army 4-Star Officer'},   //Pos 101->300
      { id: 14, name: 'Army 5-Star Officer'},   //Pos 31->100
      { id: 15, name: 'General'},               //Pos 11->30
      { id: 16, name: 'Great general'},         //Pos 4->10
      { id: 17, name: 'Commander'},             //Pos 2->3
      { id: 18, name: 'Governor'},              //Pos 1
    ];

    //CharacterClasses
    $this.characterClassIds = [
      {},
      { id: 1, name: 'Gladiator', icon: 'img/gladiator.jpg' },
      { id: 2, name: 'Templar', icon: 'img/templar.jpg' },
      {},
      { id: 4, name: 'Assassin', icon: 'img/assassin.jpg' },
      { id: 5, name: 'Ranger', icon: 'img/ranger.jpg' },
      {},
      { id: 7, name: 'Sorcerer', icon: 'img/sorc.jpg' },
      { id: 8, name: 'Spiritmaster' , icon: 'img/sm.jpg'},
      {},
      { id: 10, name: 'Cleric', icon: 'img/cleric.jpg' },
      { id: 11, name: 'Chanter', icon: 'img/chanter.jpg' },
      {},
      { id: 13, name: 'Aethertech', icon: 'img/gladiator.jpg' },
      { id: 14, name: 'Gunner', icon: 'img/gunner.png' },
      {},
      { id: 16, name: 'Bard', icon: 'img/barde.png' },
    ];

    //Get character rank by position
    $this.getCharacterRankByPosition = function(position) {

      if(position === 1) { return $this.characterSoldierRankIds[18]; }
      else if(position < 4) { return $this.characterSoldierRankIds[17]; }
      else if(position < 11) { return $this.characterSoldierRankIds[16]; }
      else if(position < 31) { return $this.characterSoldierRankIds[15]; }
      else if(position < 101) { return $this.characterSoldierRankIds[14]; }
      else if(position < 301) { return $this.characterSoldierRankIds[13]; }
      else if(position < 501) { return $this.characterSoldierRankIds[12]; }
      else if(position < 701) { return $this.characterSoldierRankIds[11]; }
      else if(position < 1001) { return $this.characterSoldierRankIds[10]; }
      else { return $this.characterSoldierRankIds[9]; }

    };

    //Gets wich is rank of the selected character
    $this.getCharacterRank = function(id) { return $this.characterSoldierRankIds[id]; };

    //Retrieves character classId
    $this.getCharacterClass = function(id) { return $this.characterClassIds[id]; };

    //Retrieves info from the selected server at indicated day
    $this.getFromServer = function(date, serverName) {

      //Try to retrieve cacheItem
      var _cachedItem = _cacheServerData.first(function(itm){
        return itm.serverName == serverName && itm.date == date;
      });

      //If there is some cache item
      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': host + 'data/Servers/' + date + '/' + serverName + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'date': date,
          'data': $data
        };

        //Store on cache
        _cacheServerData.push(_result);

        //return
        return _result;
      });
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(_getLastDate(), serverName);
    };

    //Retrieve character info
    $this.getCharacterInfo = function(serverName, characterID) {

      var _cachedItem = _cacheCharacterInfo.first(function(itm){ return itm.serverName == serverName && itm.characterID == characterID; });

      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      }).then(function(response){

        response['data']['status'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['names'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['guilds'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        return _processCharacterInfoData(serverName, response['data']).then(function($$character){
          _cacheCharacterInfo.push($$character);
          return $$character;
        });
      });

      //TODO: Replaced cuz dont works on firefox ^^
      /*return $q.likeNormal($http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      }).then(function(arg1, arg2, arg3){
        console.log(arg1);
        console.log(arg2);
        console.log(arg3);
      })).then(function($data) {
        return _processCharacterInfoData(serverName, $data).then(function($$character){
          _cacheCharacterInfo.push($$character);
          return $$character;
        });
      });*/
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() { return _getLastDate(); };

    //Get character cheat sheet
    $this.getCharacterCheatSheet = function() {
      return _getCharacterCheatSheet();
    };

    //Looks for a character on all servers
    $this.characterSearch = function(text) {

      var _$$textToSearch = text.trim().toLowerCase();

      return _getCharacterCheatSheet().then(function($wholeData) {

        var _result = $wholeData.where(function($$character){
          return $$character['characterName'].toLowerCase().indexOf(_$$textToSearch) >= 0;
        });

        _result.sort(function(a, b){
          var _idxA = a['characterName'].toLowerCase().indexOf(_$$textToSearch);
          var _idxB = b['characterName'].toLowerCase().indexOf(_$$textToSearch);

          if(_idxA === _idxB) {
            var _aLength = a['characterName'].length;
            var _bLength = b['characterName'].length;

            if(_aLength == _bLength) {
              return a['characterName'].toLowerCase().localeCompare(b['characterName'].toLowerCase());
            }

            return _aLength - _bLength;
          }

          return _idxA - _idxB;
        });

        return _result;
      });
    };

    //Retrieve last date
    function _getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

    //Gets character cheatSheet
    function _getCharacterCheatSheet() {

      if(_cacheCharacterCheatSheet !== null) {
        var $$q = $q.defer();
        $timeout(function(){
          $$q.resolve(_cacheCharacterCheatSheet);
        });
        return $$q.promise;
      }

      var _url = host + '/data/Servers/Characters/charactersSheet.json';
      return $q.likeNormal($http.get(_url)).then(function($wholeData){
        $wholeData.forEach(function($$entry){
          $$entry['characterClass'] = $this.getCharacterClass($$entry['characterClassID']);
          $$entry['soldierRank'] = $this.getCharacterRank($$entry['characterSoldierRankID']);
          $$entry['raceName'] = $$entry['characterRaceID'] == 1 ? 'Asmodian' : 'Elyos';
        });

        _cacheCharacterCheatSheet = $wholeData;
        return $wholeData;
      });
    }

    //Process character info data
    function _processCharacterInfoData(serverName, characterInfoData) {
      
      //Create result
      var _result = {
        'serverName': serverName,
        'characterID': characterInfoData['characterID'],
        'characterName': characterInfoData['characterName'],
        'names': characterInfoData['names'],
        'characterClassID': characterInfoData['characterClassID'],
        'characterClass': $this.getCharacterClass(characterInfoData['characterClassID']),
        'raceID': characterInfoData['raceID'],
        'raceName': characterInfoData['raceID'] == 1 ? 'Asmodian' : 'Elyos',
        'guildID': characterInfoData['guildID'],
        'guildName': characterInfoData['guildName'],
        'guilds': characterInfoData['guilds'],
        'gloryPoint': characterInfoData['gloryPoint'],
        'gloryPointChange': characterInfoData['gloryPointChange'],
        'position': characterInfoData['position'],
        'rankingPositionChange': characterInfoData['rankingPositionChange'],
        'soldierRankID': characterInfoData['soldierRankID'],
        'soldierRank': $this.getCharacterRank(characterInfoData['soldierRankID']),
        'status': characterInfoData['status'],
      };

      //Normalize and sort collection dates
      _normalizeCollectionDates(_result['names'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['guilds'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['status'], 'date').sort(_dateSortFn('date', 'desc'));

      //Normalize soldier ranks on each status
      _result['status'].forEach(function($$status) {
        $$status['soldierRank'] = $this.getCharacterRank($$status['soldierRankID']);
      });

      //If user request to remove old names
      $this.removeOldNames_requests.every(function($$request){
        if($$request['serverName'] == _result['serverName'] && $$request['characterID'] == _result['characterID']) {
          _result['names'].splice(1, _result['names'].length - 1);
          return false;
        }
        return true;
      });

      //If user requested to remove old guild names
      $this.removeOldGuildNames_requests.every(function($$request){
        if($$request['serverName'] == _result['serverName'] && $$request['characterID'] == _result['characterID']) {
          _result['guilds'].splice(1, _result['guilds'].length - 1);
          return false;
        }
        return true;
      });

      //Set social data to the character
      return characterSocialService.setCharacterSocialData(_result);
    }

    //Normalize a collection specified on first param on date stored on second param
    function _normalizeCollectionDates(collection, propName) {
      collection.forEach(function($$element) {
        $$element[propName] = new Date($$element[propName]);
      });
      return collection;
    }

    function _dateSortFn(propName, sort) {
      if(sort == 'asc') {
        return function(a, b) {
          return a[propName].getTime() - b[propName].getTime();
        };
      }
      else {
        return function(a, b) {
          return b[propName].getTime() - a[propName].getTime();
        };
      }
    }

    //Normalize the date
    function _normalizeDateString(dateString) {
      var _date = new Date(dateString);

      if(!isNaN(_date.getTime())) {
        return _date;
      }

      var _splitDate = dateString.split('-');

      return new Date(parseInt(_splitDate[2]), parseInt(_splitDate[0]) - 1, parseInt(_splitDate[1]));
    }

  }

})(angular);


(function(ng){
  'use strict';

  var SERVICE_NAME = 'twitchService';
  var _CLIENTID = 'vauqjofyej3848u68hpah3aqjjvjcl';

  ng.module('mainApp').service(SERVICE_NAME,['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');

    var $this = this;

    //Retrieves twitch channel
    $this.getChannel = function(channelId) {
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/channels/' + channelId,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };

    //Checks if a streamer is online
    $this.getStream = function(channelId) {
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/streams/' + channelId,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };

    //Ger current AION Streams
    $this.getAIONStreams = function() {
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/streams/?game=AION',
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };

    //Gets who is online
    $this.getOnlinePeople = function(channelIds) {
      var _strChannelIds = channelIds.join(',');
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/streams/?limit=' + channelIds.length + '&channel=' + _strChannelIds,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };
  }

})(angular);

(function(ng){
  'use strict';

  var SERVICE_NAME = 'youtubeService';
  var API_KEY = 'AIzaSyBonJFDolnHzbdBrQ1hkkEtT1FguT9zU9w';

  ng.module('mainApp').service(SERVICE_NAME,['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $gapi = $hs.$instantiate('$gapi');

    var _isStarted = false;

    var $this = this;

    function _start() {

      if(_isStarted) { return $q.resolve(); }

      var $$q = $q.defer();

      $gapi.load('client', function() {
        $gapi.client.init({
          'apiKey': API_KEY,
        }).then(function(){
          return $gapi.client.load('https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest');
        }).then(function(){
          _isStarted = true;
          $$q.resolve();
        });
      });


      return $$q.promise;
    }

    //Get last videos from channel
    $this.getLastVideosFromChannel = function(channelId) {
      return _start().then(function() {
        return $gapi.client.youtube.search.list({
          'part': 'id, snippet',
          'channelId': channelId,
          'type': 'video',
          'order': 'date',
          'maxResults': 5
        }).then(function($$response) {
          return $$response['result']['items'];
        });
      });
    };

    //Get channel id from user
    $this.getChannelFromUser = function(username) {
      return _start().then(function() {
        return $gapi.client.youtube.channels.list({
          'part': 'id, snippet, brandingSettings',
          'forUsername': username
        }).then(function($$response) {
          return $$response['result']['items'].length > 0 ? $$response['result']['items'][0] : null;
        });
      });
    };

    //Get channel id from user
    $this.getChannelFromId = function(channelId) {
      return _start().then(function() {
        return $gapi.client.youtube.channels.list({
          'part': 'id, snippet, brandingSettings',
          'id': channelId
        }).then(function($$response) {
          return $$response['result']['items'].length > 0 ? $$response['result']['items'][0] : null;
        });
      });
    };


  }

})(angular);

(function(ng) {
  'use strict';

  var SERVICE_NAME = 'helperService.$q';

  var MAIN_TIME_TRIGGER = 1000;

  ng.module('mainApp').service(SERVICE_NAME, ['$injector', _fn]);

  function _fn($injector) {

    var $this = this;
    var $q = $injector.get('$q');
    var $timeout =  $injector.get('$timeout');
    var $parent = null;
    var _timeouts = {};

    //Sets wich is current parent
    $this.$setParent = function(parent) {
      $parent = parent;
      return $this;
    };

    $this.$q = $q;

    //Changes normal promises to be like $http
    $this.$q.likeHttp = function ($$q) {

      //If is a deferred
      if ($$q.promise) {
        $$q.promise.success = function (callback) {
          $$q.promise.then(callback);
          return $$q.promise;
        };
        $$q.promise.error = function (callback) {
          $$q.promise.catch(callback);
          return $$q.promise;
        };
        return $$q;
      }

      //If is a promise
      if ($$q.then) {
        var _$$q = $this.likeHttp($q.defer());

        $$q.then(_$$q.resolve);
        $$q.catch(_$$q.catch);

        return _$$q.promise;
      }
    };

    //Changes $http promises to work like normals
    $this.$q.likeNormal = function (httpPromise) {
      var $$q = $q.defer();
      httpPromise
        .success($$q.resolve)
        .error($$q.reject);
      return $$q.promise;
    };

    //Executes a time trigger
    $this.$q.timeTrigger = function(name, fn, time) {

      //If not time
      if(!time) {
        time = MAIN_TIME_TRIGGER;
      }

      //Cancel previous timeout
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }

      _timeouts[name] = $timeout(fn, time);

      return _timeouts[name];
    };

    //Cancels a time trigger
    $this.$q.cancelTimeTrigger = function(name) {
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }
    };

  }
})(angular);