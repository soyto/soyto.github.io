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

    _init();

    /*--------------------------------------------  SCOPE FUNCTIONS  -------------------------------------------------*/

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        $sc['searchResults'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function () {

        $sc['searchTerm'] = text;
        $sc['searchLoading'] = true;

        //Google analytics event track
        $window.ga('send', 'event', 'search_event_category', 'characterInfo_onChange_search_action', text);

        return storedDataService.characterSearch(text).then(function ($data) {
          $sc['searchResults'] = $data;
          $sc['searchLoading'] = false;
        });
      }, 500);
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
      $sc['searchText'] = '';
      $sc['searchTerm'] = '';
      $sc['searchResults'] = null;
      $sc['searchLoading'] = false;
    }

    //Sets up the chart
    function _setUpChart(characterInfo) {

      var _chart = {
        'options': { 'pointHitDetectionRadius' : 4 },
        'labels': [],
        'series': [characterInfo['characterName']],
        'data': [[]]
      };

      //Retrieve last 30 days and push to chart data
      characterInfo['status'].slice(characterInfo['status'].length - 30).forEach(function($$status){
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
