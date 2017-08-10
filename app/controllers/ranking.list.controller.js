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

      //Is server data empty?
      $scope['isEmpty'] = serverData['data']['asmodians'].length === 0 && serverData['data']['elyos'].length === 0;

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
