(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.merge.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$log', '$scope', '$window', '$location', '$timeout', 'helperService',  'storedDataService', 'serversData', 'groupID', listController
  ]);

  function listController($log, $scope, $window, $location, $timeout, helperService, storedDataService, serversData, groupID) {
    $scope._name = CONTROLLER_NAME;

    $scope.filteredData = false;

    $scope.page = {};
    $scope.page.elyos = {};
    $scope.page.asmodians = {};

    _init();

    //Change server or date Fn
    $scope.goTo = function(serverMerge) {
      //Same data and server, don't do nothing
      if(serverMerge.id == groupID) {
        return;
      }

      $location.path('/merge/' + serverMerge.id);
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

      var serverNames = serversData.select(function(itm){ return itm.server.name; }).join(' + ');

      helperService.$scope.setTitle(serverNames);
      helperService.$scope.setNav('ranking.list');

      $scope.serverData = {
        data: {
          elyos: [],
          asmodians: [],
        },
        name: serverNames,
        id: groupID
      };
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

      serversData.forEach(function(server) {
        $scope.serverData.data.elyos = $scope.serverData.data.elyos.concat(server.data.elyos);
        $scope.serverData.data.asmodians = $scope.serverData.data.asmodians.concat(server.data.asmodians);
      });

      $scope.serverData.data.elyos.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });
      $scope.serverData.data.asmodians.sort(function(a,b){
        return b.gloryPoint - a.gloryPoint;
      });

      $scope.serverData.data.elyos.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });
      $scope.serverData.data.asmodians.forEach(function(character, idx){
        character.rankingPositionChange = character.position - (idx + 1);
        character.position = idx + 1;
        _calculateNewRank(character);
      });

      $scope.elyosData = _performPagination($scope.serverData.data.elyos.select(_initCharacter) , $scope.pagination.elyos);
      $scope.asmodianData = _performPagination($scope.serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
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
        $scope.elyosData = paginateElyos($scope.serverData.data.elyos.select(_initCharacter));
        $scope.asmodianData = paginateAsmodians($scope.serverData.data.asmodians.select(_initCharacter));
        $scope.filteredData = false;
        return;
      }

      //Filter elyos data
      $scope.elyosData = paginateElyos($scope.serverData.data.elyos.where(function(character) {
        return filterCharacter(character, textToSearch, classToFilter, rankToFilter);
      }).select(_initCharacter));

      //Filter asmodian data
      $scope.asmodianData = paginateAsmodians($scope.serverData.data.asmodians.where(function(character) {
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
        else if(character) {

          var charName = character.characterName ? character.characterName.toLowerCase() : '';
          var guildName = character.guildName ? character.guildName.toLowerCase() : '';
          var characterClassName = storedDataService.getCharacterClass(character.characterClassID).name.toLowerCase();
          var characterRankName = storedDataService.getCharacterRank(character.soldierRankID).name.toLowerCase();

          meetsTxt = charName.indexOf(textToSearch) >= 0 ||
            guildName.indexOf(textToSearch) >= 0 ||
            characterClassName.indexOf(textToSearch) >= 0 ||
            characterRankName.indexOf(textToSearch) >= 0;
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
