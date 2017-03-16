(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', 'serverData', _fn]);

  function _fn($sc, $hs, serverData) {

    var $log = $hs.$instantiate('$log');
    var $q = $hs.$q;
    var $location = $hs.$instantiate('$location');
    var $timeout = $hs.$instantiate('$timeout');
    var storedDataService = $hs.$instantiate('storedDataService');

    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    //ServerData
    var _serverData = {
      'serverName': null,
      'date': null,
      'stats': {
        'elyos': {
          'topHP': null,
          'topPositionChange': null,
        },
        'asmodians': {
          'topHP': null,
          'topPositionChange': null,
        }
      },
      'asmodians': {},
      'elyos':  {},
      'versus': {}
    };

    //Chart data
    var _chartData = {
      'options': {
        'responsive': true,
        'maintainAspectRatio': false,
        'legend': {
          'display': true,
        }
      },
      'labels': [],
      'series': ['Elyos', 'Asmodians'],
      'data': [[], []],
      'colors': ['#DD66DD', '#97BBCD'],
      'num_divisions': 20
    };

    //Filters data
    var _filtersData = {
      'serverName': '',
      'serverDate': '',

      'servers': [],
      'dates': [],
      'classes': [],
      'ranks': [],


    };


    //Call to init Fn
    _init();

    /*  -------------------------------------  SCOPE FUNCTIONS   ---------------------------------------------------  */

    //Change server or date Fn
    $sc.onClick_changeServerAndDate = function(newServerName, newServerDate) {

      //Same data and server, don't do nothing
      if(_serverData['name'] == newServerName && _serverData['date'] == newServerDate) {
        return;
      }

      //Change location
      $location.path('/ranking/' + newServerName + '/' + newServerDate);
    };

    /*  -------------------------------------  PRIVATE FUNCTIONS   -------------------------------------------------  */

    //Initialization Fn
    function _init() {
      //Set the controller name
      $sc['_name'] = CONTROLLER_NAME;

      $log.debug('ServerData %o', serverData);

      //Title and navigation
      $hs['$scope'].setTitle(serverData['serverName'] + ' ' + serverData['date']);
      $hs['$scope'].setNav('ranking.list');

      //Sets up the serverData
      _setUpServerData();
      _setUpChartData();
      _setUpFiltersData();


      //Set objects on scope
      $sc['serverData']  = _serverData;
      $sc['chartData'] = _chartData;
      $sc['filtersData'] = _filtersData;



      $log.debug('ChartData %o', _chartData);

      return;

      //Filters initial data
      $sc.textSearch = '';

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

      $sc.pagination = {};
      $sc.pagination.elyos = ng.copy(basePaginationObj);
      $sc.pagination.asmodians = ng.copy(basePaginationObj);
      $sc.pagination.vs = ng.copy(basePaginationObj);


      //Store in a cache the versus data generated
      initialVersusData = _generateVersusData(serverData);

      //Store and paginate 3 tables
      _initPagination(serverData.data.elyos.select(_initCharacter), $sc.pagination.elyos);
      _initPagination(serverData.data.asmodians.select(_initCharacter), $sc.pagination.asmodians);
      _initPagination(initialVersusData, $sc.pagination.vs);

      //Add watchers
      $sc.$watch('textSearch', function(newValue){
        _performFilterAndSearch(newValue, $sc.selectedClass, $sc.selectedRank);
      });
      $sc.$watch('selectedClass', function(newValue){
        _performFilterAndSearch($sc.textSearch, newValue, $sc.selectedRank);
      });
      $sc.$watch('selectedRank', function(newValue){
        _performFilterAndSearch($sc.textSearch, $sc.selectedClass, newValue);
      });
    }

    //Sets up the server data
    function _setUpServerData() {

      _serverData['name'] = serverData['serverName'];
      _serverData['date'] = serverData['date'];


      //Set stats if they are avaliable on serverData
      if(serverData['data']['status'] !== undefined) {
        _serverData['stats']['elyos']['topHP'] = '';
        _serverData['stats']['elyos']['topPositionChange'] = '';
        _serverData['stats']['asmodians']['topHP'] = '';
        _serverData['stats']['asmodians']['topPositionChange'] = '';
      }
      else {
        delete _serverData['stats'];
      }
    }

    //Will generate values for the chart
    function _setUpChartData() {

      var _step = 1000 / _chartData['num_divisions'];

      for(var i = 0; i <= _chartData['num_divisions']; i++) {

        var _position = 1000 - i * _step;

        //Normalize values
        if(_position === 0) { _position = 1; }
        if(i === 0) { _position = 999; }

        var _elyosCharacter = _findCharacterByPosition('elyos', _position);
        var _asmodianCharacter = _findCharacterByPosition('asmodians', _position);

        _chartData['labels'].push(_position);
        _chartData['data'][0].push(_elyosCharacter ? _elyosCharacter['gloryPoint']: 0);
        _chartData['data'][1].push(_asmodianCharacter ? _asmodianCharacter['gloryPoint']: 0);
      }

      function _findCharacterByPosition(faction, position) {
        return serverData['data'][faction].first(function($$character){ return $$character['position'] === position; });
      }
    }

    //Sets up filters data
    function _setUpFiltersData() {

      _filtersData['serverName'] = storedDataService['serversList']
          .first(function($$itm){ return $$itm['name'] == serverData['serverName']; });
      _filtersData['serverDate'] = serverData['date'];


      _filtersData['servers'] = storedDataService['serversList'];
      _filtersData['dates'] = storedDataService['storedDates'];
      _filtersData['classes'] = storedDataService['characterClassIds'].where(function($$itm){ return $$itm['id'] === undefined; });
      _filtersData['ranks'] = storedDataService['characterSoldierRankIds']
          .where(function($$itm){ return $$itm['id'] >= 10; })
          .sort(function(a, b){ return b['id'] - a['id']; });
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
          $sc.elyosData = _initPagination(serverData.data.elyos.select(_initCharacter), $sc.pagination.elyos);
          $sc.asmodianData = _initPagination(serverData.data.asmodians.select(_initCharacter), $sc.pagination.asmodians);
          $sc.versusData = _initPagination(initialVersusData, $sc.pagination.vs);
          return;
        }

        //Filter elyos data
        $sc.elyosData = _initPagination(serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $sc.pagination.elyos);

        //Filter asmodian data
        $sc.asmodianData = _initPagination(serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $sc.pagination.asmodians);

        //Filter versus data
        $sc.versusData = _initPagination(initialVersusData.where(function(pair){
          return filterCharacter(pair.elyo, textToSearch, classToFilter, rankToFilter) ||
            filterCharacter(pair.asmodian, textToSearch, classToFilter, rankToFilter);
        }), $sc.pagination.vs);

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
