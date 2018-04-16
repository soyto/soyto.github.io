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
