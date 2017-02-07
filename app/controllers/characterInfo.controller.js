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
