(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$moment', 'storedDataService', 'helperService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, $moment, storedDataService, helperService, characterInfo) {
    $scope._name = CONTROLLER_NAME;

    //Call to init Fn
    _init();


    function _init() {

      //Set page title
      helperService.$scope.setTitle([
        characterInfo.serverName,
        '->',
        characterInfo.data.characterName
      ].join(' '));

      //Set up character and server names and stats
      $scope.serverName = characterInfo.serverName;
      $scope.character = characterInfo.data;

      $scope.character.pictureURL = '//placehold.it/450X300/DD66DD/EE77EE/?text=' + characterInfo.characterName;

      $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyos';
      $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
      $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

      $scope.character.names = $scope.character.names.sort(_dateSortFn);
      $scope.character.status = $scope.character.status.sort(_dateSortFn);
      $scope.character.guilds = $scope.character.guilds.sort(_dateSortFn);

      $scope.character.status.forEach(function(status){
        status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
      });

      //Data pagination
      $scope.pagination = {
        currentPage: 0,
        numElementsPerPage: 10,
        numPages: -1,
        numElements: -1,
        pageNumbers: [],
        fullCollection: [],
        currentPageElements: [],
        next: _paginationObject_next,
        previous: _paginationObject_previous,
        goTo: _paginationObject_goTo
      };

      _initPagination($scope.character.status, $scope.pagination);
    }

    function _dateSortFn(a, b) { return a.date > b.date ? -1 : 1; }

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