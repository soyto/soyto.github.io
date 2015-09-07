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
