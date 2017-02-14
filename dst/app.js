/*
 * Soyto.github.io (0.15.27)
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
/* global moment, marked, jQuery */
(function(ng, navigator, moment, marked, jQuery){
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
    $routeProvider.when('/ranking/:serverName', $$IS_MOBILE ? rankingRouteMobileData :  rankingRouteData);

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
    $routeProvider.when('/ranking/:serverName/:date', $$IS_MOBILE ? rankingWithDateRouteMobileData : rankingWithDateRouteData);


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
    $routeProvider.when('/character/:serverName/:characterID', $$IS_MOBILE ? characterInfoMobileRouteData :  characterInfoRouteData);
  }

  function cfpLoadingBarFn(cfpLoadingBarProvider) {
    cfpLoadingBarProvider['includeSpinner'] = false;
    cfpLoadingBarProvider['includeBar']  = true;
  }

})(angular, navigator, moment, marked, jQuery);


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
    '$log', '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($log, $scope, $location, $timeout, helperService, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;

    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    //Call to init Fn
    _init();

    //Change server or date Fn
    $scope.goTo = function(server, serverDate) {
      //Same data and server, don't do nothing
      if(server.name == serverData.serverName && serverDate == serverData.date) {
        return;
      }

      $location.path('/ranking/' + server.name + '/' + serverDate);
    };


    //Initialization Fn
    function _init() {

      //Title and navigation
      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);
      helperService.$scope.setNav('ranking.list');

      //Store data on scope...
      $scope.serverData = serverData;

      //Filters initial data
      $scope.textSearch = '';
      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      //Filters data
      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });
      $scope.ranks = storedDataService.characterSoldierRankIds
        .where(function(itm){ return itm.id >= 10; })
        .sort(function(a, b){ return b.id - a.id; });

      //Set up pagination needed data
      var basePaginationObj = {
        currentPage: 0,
        numElementsPerPage: 100,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      $scope.pagination = {};
      $scope.pagination.elyos = ng.copy(basePaginationObj);
      $scope.pagination.asmodians = ng.copy(basePaginationObj);
      $scope.pagination.vs = ng.copy(basePaginationObj);


      //Generate data that will go to chart
      _generateChartData(serverData);

      //Store in a cache the versus data generated
      initialVersusData = _generateVersusData(serverData);

      //Store and paginate 3 tables
      _initPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      _initPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
      _initPagination(initialVersusData, $scope.pagination.vs);

      //Add watchers
      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch(newValue, $scope.selectedClass, $scope.selectedRank);
      });
      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch($scope.textSearch, newValue, $scope.selectedRank);
      });
      $scope.$watch('selectedRank', function(newValue){
        _performFilterAndSearch($scope.textSearch, $scope.selectedClass, newValue);
      });
    }

    //Initializes a character
    function _initCharacter(character) {
      if(!character) {
        return {};
      }
      character.characterClass = storedDataService.getCharacterClass(character.characterClassID);
      character.soldierRank = storedDataService.getCharacterRank(character.soldierRankID);

      return character;
    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        //If not filter is provided
        if(!classToFilter && !textToSearch && !rankToFilter) {
          $scope.elyosData = _initPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
          $scope.asmodianData = _initPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
          $scope.versusData = _initPagination(initialVersusData, $scope.pagination.vs);
          return;
        }

        //Filter elyos data
        $scope.elyosData = _initPagination(serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.elyos);

        //Filter asmodian data
        $scope.asmodianData = _initPagination(serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.asmodians);

        //Filter versus data
        $scope.versusData = _initPagination(initialVersusData.where(function(pair){
          return filterCharacter(pair.elyo, textToSearch, classToFilter, rankToFilter) ||
            filterCharacter(pair.asmodian, textToSearch, classToFilter, rankToFilter);
        }), $scope.pagination.vs);

      }, 500);

      //Filters a character
      function filterCharacter(character, txt, classToFilter, rankToFilter) {
        var meetsTxt = false;
        var meetsClass = false;
        var meetsRank = false;

        if(!txt) {
          meetsTxt = true;
        }
        else if(character && character.characterName) {

          var searchTxt = txt.toLowerCase();

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

        return meetsTxt && meetsClass && meetsRank;
      }
    }

    //Will generate versus data
    function _generateVersusData(serverData) {
      var versusData = [];

      //Generate the data
      for(var i = 0; i < 1000; i++) {
        versusData.push({
          position: i + 1,
          elyo: {},
          asmodian: {},
        });
      }


      serverData.data.elyos.select(_initCharacter).forEach(function(character){
        versusData[character.position - 1].elyo = character;
      });
      serverData.data.asmodians.select(_initCharacter).forEach(function(character){
        versusData[character.position - 1].asmodian = character;
      });

      return versusData;
    }

    //Will generate values for the chart
    function _generateChartData(serverData) {

      var num_elements = 10;
      var step = 1000 / num_elements;

      $scope.chart = {};
      $scope.chart.options = {
        responsive: true,
        maintainAspectRatio: false
      };

      $scope.chart.labels = [];
      $scope.chart.series = ['Elyos', 'Asmodians'];
      $scope.chart.data = [[],[]];
      $scope.chart.colors = ['#DD66DD', '#97BBCD'];

      for(var i = 0; i <= num_elements; i++) {
        var position = 1000 - i * step;

        if(position === 0) {
          position = 1;
        }

        if(i === 0) {
          position = 999;
        }

        /* jshint-W083 */
        var elyosCharacter = serverData.data.elyos.first(function(char){ return char.position == position;});
        var asmodianCharacter = serverData.data.asmodians.first(function(char){ return char.position == position;});
        /* jshint+W083 */

        $scope.chart.labels.push(position);
        $scope.chart.data[0].push(elyosCharacter ? elyosCharacter.gloryPoint : 0);
        $scope.chart.data[1].push(asmodianCharacter ? asmodianCharacter.gloryPoint : 0);
      }
    }


    //Initializes pagination
    function _initPagination(originalElements, paginationObj) {

      paginationObj.currentPage = 0;
      paginationObj.numPages = parseInt(originalElements.length / paginationObj.numElementsPerPage);
      paginationObj.numElements = originalElements.length;
      paginationObj.fullCollection = originalElements;

      if(originalElements.length % paginationObj.numElementsPerPage > 0) {
        paginationObj.numPages += 1;
      }

      if(paginationObj.numPages === 0){
        paginationObj.numPages = 1;
      }

      paginationObj.currentPageElements = paginationObj.fullCollection.slice(0, paginationObj.numElementsPerPage);

      //Wich are the pageNumbers that we hold
      paginationObj.pageNumbers = Array.apply(null, {length: paginationObj.numPages}).map(function(current, idx){ return idx + 1; }, Number);
    }

    //Fn for pagination Objects that will go to next page
    function _paginationObject_next() {
      var $this = this;

      //If we are on last page
      if($this.currentPage + 1 >= $this.numPages) {
        return; //Dont do nothin
      }

      $this.currentPage += 1;

      var idx = $this.currentPage * $this.numElementsPerPage;

      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Fn for pagination objects that will go to previous page
    function _paginationObject_previous() {
      var $this = this;

      if($this.currentPage === 0) {
        return; //If we are on first page, dont do nothing
      }

      $this.currentPage -= 1;

      var idx = $this.currentPage * $this.numElementsPerPage;
      $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
    }

    //Go to an specific page
    function _paginationObject_goTo(numPage) {
      var $this = this;

      if(numPage > 0 && numPage <= $this.numPages) {
        $this.currentPage = numPage - 1;
        var idx = $this.currentPage * $this.numElementsPerPage;
        $this.currentPageElements = $this.fullCollection.slice(idx, $this.numElementsPerPage + idx);
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
      _performFilterAndSearch($scope.textSearch, $scope.selectedClass, $scope.selectedRank);
    };

    $scope.clear = function(){
      $scope.textSearch = '';
      $scope.selectedClass = '';
      _performFilterAndSearch('', null, null);

      $scope.textSearch = '';
      $scope.selectedClass = null;
      $scope.selectedRank = null;
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

      $scope.textSearch = '';
      $scope.selectedClass = '';


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

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,['$hs', _fn]);


  function _fn($hs) {

    var $rs = $hs.$instantiate('$rootScope');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var cfpLoadingBar = $hs.$instantiate('cfpLoadingBar');

    $rs['_name'] = CONTROLLER_NAME;


    $rs.$on('$routeChangeStart', function(){ cfpLoadingBar.start(); });

    $rs.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', {'page': $location.path() });
    });
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
        }, 200, 'swing');
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

  ng.module('mainApp').service('characterSocialService',[
    '$hs', _fn
  ]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $this = this;

    var _characterSocialCache = null;

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
      'setNav': function(menu){ $rs.navMenu = menu; }
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

  var host = DEBUG ? '' : 'http://91.184.11.238/';

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $timeout = $hs.$instantiate('$timeout');
    var characterSocialService = $hs.$instantiate('characterSocialService');

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
    ];

    //Who asked to remove his old guild names
    $this.removeOldGuildNames_requests = [
      {'serverName': 'Hellion', 'characterID': 495423}, //Chetitos
      {'serverName': 'Deyla', 'characterID': 1266763}, //Kaijur
      {'serverName': 'Hyperion', 'characterID': 11600}, //Raynee
      {'serverName': 'Antriksha', 'characterID': 863503}, //Nukey
    ];

    //Wich servers
    $this.serversList = [
      {id : 53, name: 'Antriksha'},   //0
      {id : 49, name: 'Barus'},       //1
      {id : 52, name: 'Deyla'},       //2
      {id : 54, name: 'Hellion'},     //3
      {id : 55, name: 'Hyperion'},    //4
      {id : 50, name: 'Loki'},        //5
      {id : 37, name: 'Thor'},        //6
      {id : 40, name: 'Urtem'},       //7
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
      { id: 10, name: 'Army 1-Star Officer'},
      { id: 11, name: 'Army 2-Star Officer'},
      { id: 12, name: 'Army 3-Star Officer'},
      { id: 13, name: 'Army 4-Star Officer'},
      { id: 14, name: 'Army 5-Star Officer'},
      { id: 15, name: 'General'},
      { id: 16, name: 'Great general'},
      { id: 17, name: 'Commander'},
      { id: 18, name: 'Governor'},
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
    $this.getLastServerData = function() {
      return _getLastDate();
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
          $$entry['raceName'] = $$entry['raceID'] == 1 ? 'Asmodian' : 'Elyos';
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
      httpPromise.success($$q.resolve).error($$q.reject);
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