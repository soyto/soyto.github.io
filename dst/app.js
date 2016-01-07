/*
 * Soyto.github.io (0.8.0)
 *     DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *         Version 2, December 2004
 * 
 * Copyright (C) 2012 Romain Lespinasse <romain.lespinasse@gmail.com>
 * 
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 * 
 * DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 * 
 */
/* global moment, marked */
(function(ng, navigator, moment, marked){
  'use strict';

  ng.module('mainApp',[
    'ngRoute',
    'ngSanitize',
    'angular-loading-bar',
    'chart.js',
	  'mgcrea.ngStrap',
	  'ngAnimate'
  ]);

  ng.module('mainApp').constant('$moment', moment);
  ng.module('mainApp').constant('$marked', marked);
  ng.module('mainApp').config(['$routeProvider', configRoutes]);
  ng.module('mainApp').config(['cfpLoadingBarProvider', cfpLoadingBarFn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
  var isMobile =  IS_MOBILE_REGEX_1.test(navigator.userAgent) || IS_MOBILE_REGEX_2.test(navigator.userAgent.substr(0,4));

  function configRoutes($routeProvider) {

    //Index route
    var indexRouteData = {
      templateUrl: '/app/templates/index.html',
      controller: 'mainApp.index.controller',
      resolve: {
        posts: ['helperService', 'blogService', 'consoleService', function(helperService, blogService){
          return helperService.$q.likeNormal(blogService.getAll());
        }]
      }
    };
    $routeProvider.when('/', indexRouteData);

    //Ranking route
    var rankingRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', 'consoleService', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getLastFromServer($route.current.params.serverName));
        }]
      }
    };
    var rankingRouteMobileData = {
      templateUrl: '/app/templates/ranking.mobile.html',
      controller: 'mainApp.ranking.list.mobile.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', 'consoleService', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getLastFromServer($route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', isMobile ? rankingRouteMobileData :  rankingRouteData);

    var rankingWithDateRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getFromServer($route.current.params.date, $route.current.params.serverName));
        }]
      }
    };
    var rankingWithDateRouteMobileData = {
      templateUrl: '/app/templates/ranking.mobile.html',
      controller: 'mainApp.ranking.list.mobile.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getFromServer($route.current.params.date, $route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', isMobile ? rankingWithDateRouteMobileData : rankingWithDateRouteData);


    var characterInfoRouteData = {
      templateUrl: '/app/templates/characterInfo.html',
      controller: 'mainApp.characterInfo.controller',
      resolve: {
        characterInfo: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getCharacterInfo($route.current.params.serverName, $route.current.params.characterID));
        }]
      }
    };
    var characterInfoMobileRouteData = {
      templateUrl: '/app/templates/characterInfo.mobile.html',
      controller: 'mainApp.characterInfo.mobile.controller',
      resolve: {
        characterInfo: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getCharacterInfo($route.current.params.serverName, $route.current.params.characterID));
        }]
      }
    };
    $routeProvider.when('/character/:serverName/:characterID', isMobile ? characterInfoMobileRouteData :  characterInfoRouteData);


    var mergeRouteData = {
      templateUrl: '/app/templates/merge.html',
      controller: 'mainApp.merge.list.controller',
      resolve: {
        serversData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {

          var servers = storedDataService.mergeGroups[$route.current.params.groupID];
          var serversData = [];

          var $$q = helperService.$q.resolve();

          servers.forEach(function(server){
            $$q = $$q.then(function(){
              return helperService.$q.likeNormal(storedDataService.getLastFromServer(server.name)).then(function(serverData){
                serversData.push({
                  server: server,
                  data: serverData.data,
                  date: serverData.date
                });
              });
            });
          });


          return $$q = $$q.then(function(){ return serversData; });
        }],
        groupID: ['$route', function($route){
          return $route.current.params.groupID;
        }]
      }
    };
    var mergeMobileRouteData = {
      templateUrl: '/app/templates/merge.mobile.html',
      controller: 'mainApp.merge.list.mobile.controller',
      resolve: {
        serversData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {

          var servers = storedDataService.mergeGroups[$route.current.params.groupID];
          var serversData = [];

          var $$q = helperService.$q.resolve();

          servers.forEach(function(server){
            $$q = $$q.then(function(){
              return helperService.$q.likeNormal(storedDataService.getLastFromServer(server.name)).then(function(serverData){
                serversData.push({
                  server: server,
                  data: serverData.data,
                  date: serverData.date
                });
              });
            });
          });


          return $$q = $$q.then(function(){ return serversData; });
        }],
        groupID: ['$route', function($route){
          return $route.current.params.groupID;
        }]
      }
    };
    $routeProvider.when('/merge/:groupID', isMobile ? mergeMobileRouteData : mergeRouteData);
  }

  function cfpLoadingBarFn(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar  = true;
  }

})(angular, navigator, moment, marked);


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.controller';

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

		  $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyos';
		  $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
		  $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

		  $scope.character.names = $scope.character.names.sort(_dateSortFn);
		  $scope.character.status = $scope.character.status.sort(_dateSortFn);
		  $scope.character.guilds = $scope.character.guilds.sort(_dateSortFn);

		  $scope.character.status.forEach(function(status){
			  status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
		  });

		  //Set up chart
		  //TOD for performance the best is have only 30 points
		  //ATm we are only retrieving 30 last days, will eb great a system that ponderates days
		  $scope.chart = {};

		  $scope.chart.options = {
			  pointHitDetectionRadius : 4
		  };
		  $scope.chart.labels = [];
		  $scope.chart.series = [characterInfo.data.characterName];
		  $scope.chart.data = [[]];

		  ng.copy($scope.character.status)
			  .sort(function(a, b){ return a.date > b.date ? 1 : -1; })
			  .slice($scope.character.status.length - 30) //We only want last 30 days
			  .forEach(function(status){
				  $scope.chart.labels.push($moment(status.date).format('MM-DD-YYYY'));
				  $scope.chart.data[0].push(status.gloryPoint);
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

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$marked', 'helperService', 'storedDataService', 'posts', index_controller
  ]);


  function index_controller($scope, $marked, helperService, storedDataService, posts) {
    $scope._name = CONTROLLER_NAME;

    $scope.servers = storedDataService.serversList;
    $scope.lastServerUpdateData = storedDataService.getLastServerData();
    $scope.posts = posts.select(function(post){
      post.htmlContent = $marked(post.content);
      return post;
    });


    helperService.$scope.setTitle('Soyto.github.io');
    helperService.$scope.setNav('home');
  }
})(angular);


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


(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,[
    '$rootScope', '$window', '$location', 'cfpLoadingBar', main_controller
  ]);


  function main_controller($rootScope, $window, $location, cfpLoadingBar) {
    $rootScope._name = CONTROLLER_NAME;


    $rootScope.$on('$routeChangeStart', function(){
      cfpLoadingBar.start();
    });

    $rootScope.$on('$viewContentLoaded', function(event){
      cfpLoadingBar.complete();
      $window.ga('send', 'pageview', { page: $location.path() });
    });
  }

})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('blogService', [
    '$http', 'helperService', blogService
  ]);


  function blogService($http, helperService) {

    var $this = this;

    var cachedPosts = [];


    $this.getAll = function() {
      var $$q = helperService.$q.new();

      if(cachedPosts.length > 0 ) {
        $$q.resolve(cachedPosts);
      }
      else {
        var sp = $http({
          url: 'data/Posts/posts.json',
          method: 'GET'
        });

        sp.success(function(data){
          data = data.sort(function(a,b){
            return a.date > b. date ? -1 : 1;
          });
          cachedPosts = data;
          $$q.resolve(data);
        });


        sp.error($$q.reject);
      }

      return helperService.$q.likeHttp($$q.promise);
    };
  }
})(angular);


(function(ng){
	'use strict';

	ng.module('mainApp').service('consoleService',[
		'$window', '$q', 'helperService', 'storedDataService', consoleService
	]);


	function consoleService($window, $q, helperService, storedDataService) {

		var $this = this;
		$window.soyto = $this;


		//Expose $q
		$this.$q = $q;

		//Expose whole service
		$this.storedDataService = storedDataService;


	}
})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('helperService', [
    '$q', '$rootScope', '$window', '$log', helper_service
  ]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

  function helper_service($q, $rootScope, $window, $log) {

    var $this = this;
    $this.$scope = {};
    $this.$q = {};
    $this.navigator = {};

    //Sets page title
    $this.$scope.setTitle = function(value) {
      $rootScope.title = value;
    };

    $this.$scope.setNav = function(menu) {
      $rootScope.navMenu = menu;
    };

    //Sort dates
    $this.sortDates = function(dates) {

     $log.debug(dates);

      dates = dates.sort(function(a, b) {

        var _a = a.split('-');
        var _b = b.split('-');

        _a = [
            parseInt(_a[2]),
            parseInt(_a[0]),
            parseInt(_a[1]),
        ];

        _b = [
          parseInt(_b[2]),
          parseInt(_b[0]),
          parseInt(_b[1]),
        ];


        if(_a[0] > _b[0]) { return 1; }
        if(_a[0] < _b[0]) { return -1; }

        if(_a[1] > _b[1]) { return 1; }
        if(_a[1] < _b[1]) { return -1; }

        if(_a[2] > _b[2]) { return 1; }
        if(_a[2] < _b[2]) { return -1; }


        return 0;
      });

      $log.debug(dates);

      return dates;
    };


    $this.$q.fcall = function(fn) {
      var $$q = $q.defer();

      if(fn) {
        $$q.resolve(fn());
      } else {
        $$q.resolve();
      }

      return $$q.promise;
    };

    $this.$q.pfcall = function(fn){
      var $$q = $q.defer();

      if(fn) {
        $$q.resolve(fn());
      } else {
        $$q.resolve();
      }

      return $$q;
    };

    $this.$q.likeHttp = function($$q) {

      //If is a deferred
      if($$q.promise) {
        $$q.promise.success = function(callback){ $$q.promise.then(callback); return $$q.promise; };
        $$q.promise.error = function(callback){ $$q.promise.catch(callback); return $$q.promise; };
        return $$q;
      }

      //If is a promise
      if($$q.then) {
        var _$$q =  $this.$q.likeHttp($q.defer());

        $$q.then(_$$q.resolve);
        $$q.catch(_$$q.catch);

        return _$$q.promise;
      }
    };

    $this.$q.likeNormal = function(httpPromise) {
      var $$q = $q.defer();
      httpPromise.success($$q.resolve).error($$q.reject);
      return $$q.promise;
    };

    //Returns just a new promise (Will remove all $q dependencies)
    $this.$q.new = function(){
      return $q.defer();
    };

    $this.$q.resolve = function() {
      return $q.resolve();
    };

    $this.$q.all = function(items) {
      return $q.all(items);
    };


    $this.navigator.isMobile = function() {
      return IS_MOBILE_REGEX_1.test($window.navigator.userAgent) ||
        IS_MOBILE_REGEX_2.test($window.navigator.userAgent.substr(0,4));
    };
  }

})(angular);


(function(ng){
  'use strict';

  var DEBUG = false;

  var host = DEBUG ? '' : 'http://91.184.11.238/';

  ng.module('mainApp').service('storedDataService',[
    '$http', '$window', 'helperService', storedData_service
  ]);

  function storedData_service($http, $window, helperService) {


    var _cacheServerData = [];
    var _cacheCharacterInfo = [];

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;


    var $this = this;

    //Wich servers
    $this.serversList = [
      {id : 47, name: 'Alquima'},     //0
      {id : 46, name: 'Anuhart'},     //1
      {id : 39, name: 'Balder'},      //2
      {id : 49, name: 'Barus'},       //3
      {id : 45, name: 'Calindi'},     //4
      {id : 48, name: 'Curatus'},     //5
      {id : 36, name: 'Kromede'},     //6
      {id : 44, name: 'Nexus'},       //7
      {id : 34, name: 'Perento'},     //8
      {id : 31, name: 'Spatalos'},    //9
      {id : 42, name: 'Suthran'},     //10
      {id : 32, name: 'Telemachus'},  //11
      {id : 37, name: 'Thor'},        //12
      {id : 40, name: 'Urtem'},       //13
      {id : 43, name: 'Vehalla'},     //14
      {id : 51, name: 'Zubaba'},      //15
    ];

    //Merge groups
    $this.mergeGroups = [
      [$this.serversList[0],  $this.serversList[1]],                            //0
      [$this.serversList[14], $this.serversList[6], $this.serversList[2]],      //1
      [$this.serversList[11], $this.serversList[9], $this.serversList[5]],      //2
      [$this.serversList[8],  $this.serversList[7], $this.serversList[15]],      //3
      [$this.serversList[4],  $this.serversList[10]]                            //4
    ];

    //Wich dates we have stored
    $this.storedDates = helperService.sortDates($window.storedDates);

    //Character soldier ranks
    $this.characterSoldierRankIds = [
      { id: 0, name: 'Unknown'},
      { id: 1, name: 'Unknown'},
      { id: 2, name: 'Unknown'},
      { id: 3, name: 'Unknown'},
      { id: 4, name: 'Unknown'},
      { id: 5, name: 'Unknown'},
      { id: 6, name: 'Unknown'},
      { id: 6, name: 'Unknown'},
      { id: 7, name: 'Unknown'},
      { id: 9, name: 'Unknown'},
      { id: 10, name: 'Army 1-Star Officer'},
      { id: 11, name: 'Army 2-Star Officer'},
      { id: 12, name: 'Army 3-Star Officer'},
      { id: 13, name: 'Army 4-Star Officer'},
      { id: 14, name: 'Army 5-Star Officer'},
      { id: 15, name: 'General'},
      { id: 16, name: 'Great general'},
      { id: 17, name: 'Commander'},
      { id: 18, name: 'Governor'},
    ];

    //CharacterClasses
    $this.characterClassIds = [
      {},
      { id: 1, name: 'Gladiator', icon: 'img/gladiator.jpg' },
      { id: 2, name: 'Templar', icon: 'img/templar.jpg' },
      {},
      { id: 4, name: 'Assassin', icon: 'img/assassin.jpg' },
      { id: 5, name: 'Ranger', icon: 'img/ranger.jpg' },
      {},
      { id: 7, name: 'Sorcerer', icon: 'img/sorc.jpg' },
      { id: 8, name: 'Spiritmaster' , icon: 'img/sm.jpg'},
      {},
      { id: 10, name: 'Cleric', icon: 'img/cleric.jpg' },
      { id: 11, name: 'Chanter', icon: 'img/chanter.jpg' },
      {},
      { id: 13, name: 'Aethertech', icon: 'img/gladiator.jpg' },
      { id: 14, name: 'Gunner', icon: 'img/gunner.png' },
      {},
      { id: 16, name: 'Bard', icon: 'img/barde.png' },
    ];

    $this.getCharacterRank = function(id){
      return $this.characterSoldierRankIds[id];
    };

    //Retrieves character classId
    $this.getCharacterClass = function(id){
      return $this.characterClassIds[id];
    };

    //Retrieves info from the selected server at indicated day
    $this.getFromServer = function(date, serverName) {
      var url = host + 'data/Servers/' + date + '/' + serverName + '.json';

      var $$q = helperService.$q.new();

      var cachedItem = _cacheServerData.first(function(itm){ return itm.serverName == serverName && itm.date == date; });

      if(cachedItem) {
        $$q.resolve(cachedItem);
      }
      else {

        var sp = $http({
          url: url,
          method: 'GET'
        });

        sp.success(function(data){

          var result = {
            serverName: serverName,
            date: date,
            data: data
          };
          _cacheServerData.push(result);
          $$q.resolve(result);
        });

        sp.error($$q.reject);
      }

      return helperService.$q.likeHttp($$q.promise);
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(getLastDate(), serverName);
    };

    //Retrieve character info
    $this.getCharacterInfo = function(serverName, characterID) {
      var url = host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json';

      var $$q = helperService.$q.new();

      var cachedItem = _cacheCharacterInfo.first(function(itm){ return itm.serverName == serverName && itm.characterID == characterID; });

      if(cachedItem) {
        $$q.resolve(cachedItem);
      }
      else {
        var sp = $http({
          url: url,
          method: 'GET'
        });

        sp.success(function(data){

          var result = {
            serverName: serverName,
            characterID: characterID,
            data: data
          };

          _cacheCharacterInfo.push(result);
          $$q.resolve(result);
        });

        sp.error($$q.reject);
      }

      return helperService.$q.likeHttp($$q.promise);
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() {
      return getLastDate();
    };


    function getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

  }

})(angular);


(function(ng){
  'use strict';

  ng.module('mainApp').directive('fbCommentPlugin', ['$window', function($window)  {
    function createHTML(href, numposts, colorscheme) {
        return '<div class="fb-comments" ' +
                       'data-href="' + href + '" ' +
                       'data-numposts="' + numposts + '" ' +
                       'data-colorsheme="' + colorscheme + '">' +
               '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var colorscheme = attrs.colorscheme || 'light';

                elem.html(createHTML(href, numposts, colorscheme));

                if($window.FB) {
                  $window.FB.XFBML.parse(elem[0]);
                }
            });
        }
    };
  }]);

})(angular);
