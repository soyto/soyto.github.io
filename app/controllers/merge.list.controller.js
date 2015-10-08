(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serversData', 'groupID', listController
  ]);

  function listController($log, $scope, $location, $timeout, helperService, storedDataService, serversData, groupID) {

    $scope._name = CONTROLLER_NAME;
    var textSearch_timeoutPromise = null;

    //Call to init Fn
    _init();

    //Change server or date Fn
    $scope.goTo = function(serverMerge) {
      //Same data and server, don't do nothing
      if(serverMerge.id == groupID) {
        return;
      }

      $location.path('/merge/' + serverMerge.id);
    };

    //Initialization Fn
    function _init() {

      var serverNames = serversData.select(function(itm){ return itm.server.name; }).join(' + ');

      //Title and navigation
      helperService.$scope.setTitle(serverNames);
      helperService.$scope.setNav('ranking.merges.list');

      //Store data on scope...
      $scope.serverData = {
        data: {
          elyos: [],
          asmodians: [],
        },
        name: serverNames,
        id: groupID
      };

      //Filters initial data
      $scope.textSearch = '';
      $scope.mergeGroups = storedDataService.mergeGroups.select(function(group, idx) {
        return {
          id: idx,
          name: group.select(function(itm){ return itm.name; }).join(' + ')
        };
      });
      $scope.currentMerge = $scope.mergeGroups.first(function(itm){ return itm.id == groupID; });
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


      var copyCharFn = function(character){ return ng.copy(character); };


      //Join servers data for the merge
      serversData.forEach(function(server) {
        $scope.serverData.data.elyos = $scope.serverData.data.elyos.concat(server.data.elyos).select(copyCharFn);
        $scope.serverData.data.asmodians = $scope.serverData.data.asmodians.concat(server.data.asmodians).select(copyCharFn);
      });

      $scope.serverData.data.elyos.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });
      $scope.serverData.data.asmodians.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });

      $scope.serverData.data.elyos.forEach(function(character, idx){
        character.oldRankingPositionChange = character.rankingPositionChange;
        character.rankingPositionChange = character.position - (idx + 1);
        character.oldPosition = character.position;
        character.position = idx + 1;

        character.oldSoldierRankID = character.soldierRankID;
        _calculateNewRank(character);
      });
      $scope.serverData.data.asmodians.forEach(function(character, idx){
        character.oldRankingPositionChange = character.rankingPositionChange;
        character.rankingPositionChange = character.position - (idx + 1);
        character.oldPosition = character.position;
        character.position = idx + 1;

        character.oldSoldierRankID = character.soldierRankID;
        _calculateNewRank(character);
      });

      _initPagination($scope.serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
      _initPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);

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
      character.oldSoldierRank = storedDataService.getCharacterRank(character.oldSoldierRankID);

      return character;
    }

    //Calculates new rank
    function _calculateNewRank(character) {

      if(character.position == 1) {
        character.soldierRankID = 18;
        return;
      }

      if(character.position <= 3) {
        character.soldierRankID = 17;
        return;
      }

      if(character.position <= 10) {
        character.soldierRankID = 16;
        return;
      }

      if(character.position <= 30) {
        character.soldierRankID = 15;
        return;
      }

      if(character.position <= 100) {
        character.soldierRankID = 14;
        return;
      }

      if(character.position <= 300) {
        character.soldierRankID = 13;
        return;
      }

      if(character.position <= 500) {
        character.soldierRankID = 12;
        return;
      }

      if(character.position <= 700) {
        character.soldierRankID = 11;
        return;
      }

      if(character.position <= 999) {
        character.soldierRankID = 10;
        return;
      }

      character.soldierRankID = 9;

    }

    //Will perform filter and search :)
    function _performFilterAndSearch(textToSearch, classToFilter, rankToFilter) {

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        //If not filter is provided
        if(!classToFilter && !textToSearch && !rankToFilter) {
          _initPagination($scope.serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
          _initPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
          return;
        }

        //Filter elyos data
        _initPagination($scope.serverData.data.elyos.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.elyos);

        //Filter asmodian data
        _initPagination($scope.serverData.data.asmodians.where(function(character) {
          return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
        }).select(_initCharacter), $scope.pagination.asmodians);

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

          var searchTxt = textToSearch.toLowerCase();

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();
          var serverName = character.serverName ? character.serverName.toLowerCase() : '';

          meetsTxt = charName.indexOf(searchTxt) >= 0 ||
            guildName.indexOf(searchTxt) >= 0 ||
            characterClassName.indexOf(searchTxt) >= 0 ||
            characterRankName.indexOf(searchTxt) >= 0 ||
            serverName.indexOf(searchTxt) >= 0;
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
