(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [ '$log',
    '$scope', '$location', '$timeout',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($log, $scope, $location, $timeout, storedDataService, serverData) {

    $scope._name = CONTROLLER_NAME;
    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    _init();

    $scope.page = {
      elyos: {},
      asmodians: {}
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

    //Performs search
    $scope.search = function(){
      _performFilterAndSearch($scope.selectedClass, $scope.textSearch);
    };

    function _init() {

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

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

      $scope.textSearch = '';
      $scope.selectedClass = '';

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
    function _performFilterAndSearch(classToFilter, textToSearch) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        $scope.pagination.elyos.currentPage = 0;
        $scope.pagination.asmodians.currentPage = 0;

        var filterAndSearchFn = function(character){
          if(classToFilter && textToSearch) {
            return character.characterClassID == classToFilter.id && character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          } else if(classToFilter) {
            return character.characterClassID == classToFilter.id;
          } else {
            return character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          }
        };

        if (classToFilter || textToSearch) {

          $scope.elyosData = _performPagination(serverData.data.elyos.where(filterAndSearchFn).select(_initCharacter), $scope.pagination.elyos);
          $scope.asmodianData = _performPagination(serverData.data.asmodians.where(filterAndSearchFn).select(_initCharacter), $scope.pagination.asmodians);

        } else {
          $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
          $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
        }

      },500);

    }

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