/*
 * Soyto.github.io (1.0.14)
 * 				DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * 					Version 2, December 2004
 * Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 * 
 * 				DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * 		TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 * 
 * 0. You just DO WHAT THE FUCK YOU WANT TO.
 */
(function(ng){
  'use strict';

  ng.module('mainApp',[
    'ngRoute'
  ]);

  ng.module('mainApp').config(['$routeProvider', configRoutes]);


  function configRoutes($routeProvider) {

    //Index route
    var indexRouteData = {
      templateUrl: '/app/templates/index.html',
      controller: 'mainApp.index.controller',
    };
    $routeProvider.when('/', indexRouteData);

    //Ranking route
    var rankingRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getLastFromServer($route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName', rankingRouteData);

    var rankingWithDateRouteData = {
      templateUrl: '/app/templates/ranking.html',
      controller: 'mainApp.ranking.list.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
          return helperService.$q.likeNormal(storedDataService.getFromServer($route.current.params.date, $route.current.params.serverName));
        }]
      }
    };
    $routeProvider.when('/ranking/:serverName/:date', rankingWithDateRouteData);
  }


})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'storedDataService', index_controller
  ]);


  function index_controller($scope, storedDataService) {
    $scope._name = CONTROLLER_NAME;
    $scope.servers = storedDataService.serversList;

  }
})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$location', '$timeout',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($scope, $location, $timeout, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;
    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    _init();

    function _init() {
      $scope.serverData = serverData;

      $scope.storedDates = storedDataService.storedDates;
      $scope.servers = storedDataService.serversList;
      $scope.classes = storedDataService.characterClassIds.where(function(itm){ return itm.id; });

      $scope.searchDate = serverData.date;
      $scope.currentServer = storedDataService.serversList.first(function(server){ return server.name == serverData.serverName; });

      $scope.elyosData = serverData.data.elyos.select(_initCharacter);
      $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);

      $scope.textSearch = '';
      $scope.selectedClass = '';


      if(serverData.data.elyos.length > serverData.data.asmodians.length) {

        serverData.data.elyos.forEach(function (elyosCharacter) {
          var asmodianCharacter = serverData.data.asmodians.first(function(asmodian){ return asmodian.position == elyosCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: elyosCharacter.position,
            rankName: elyosCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });

      } else if(serverData.data.elyos.length < serverData.data.asmodians.length) {

        serverData.data.asmodians.forEach(function (asmodianCharacter) {
          var elyosCharacter = serverData.data.elyos.first(function(elyos){ return elyos.position == asmodianCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: asmodianCharacter.position,
            rankName: asmodianCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });


      } else if(serverData.data.elyos.length ==  serverData.data.asmodians.length) {
        serverData.data.elyos.forEach(function (elyosCharacter, idx) {
          var asmodianCharacter = serverData.data.asmodians.first(function(asmodian){ return asmodian.position == elyosCharacter.position; });

          var elyo = _initCharacter(elyosCharacter);
          var asmodian = _initCharacter(asmodianCharacter);

          initialVersusData.push({
            position: elyosCharacter.position,
            rankName: elyosCharacter.soldierRank,
            elyo: elyo,
            asmodian: asmodian
          });
        });
      }

      $scope.versusData = initialVersusData;

      //On date changed
      $scope.$watch('searchDate', function(newValue){
        if(newValue != serverData.date) {
          $location.path('/ranking/' + serverData.serverName + '/' + newValue);
        }
      });

      $scope.$watch('currentServer', function(newValue){
        if(newValue.name != serverData.serverName) {
          $location.path('/ranking/' + newValue.name + '/' + serverData.date);
        }
      });

      $scope.$watch('selectedClass', function(newValue){
        _performFilterAndSearch(newValue, $scope.textSearch);
      });
      $scope.$watch('textSearch', function(newValue){
        _performFilterAndSearch($scope.selectedClass, newValue);
      });
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

        var filterAndSearchFn = function(character){
          if(classToFilter && textToSearch) {
            return character.characterClassID == classToFilter.id && character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          } else if(classToFilter) {
            return character.characterClassID == classToFilter.id;
          } else {
            return character.characterName.toLowerCase().indexOf(textToSearch) >= 0;
          }
        };

        var filterAndSearchInVersus = function(pair) {

          if(classToFilter && textToSearch) {
            return pair.elyo && pair.elyo.characterName &&  pair.elyo.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 && pair.elyo.characterClassID == classToFilter.id ||
              pair.asmodian && pair.asmodian.characterName && pair.asmodian.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 && pair.asmodian.characterClassID == classToFilter.id;
          } else if(classToFilter) {
            return pair.elyo && pair.elyo.characterName && pair.elyo.characterClassID == classToFilter.id ||
              pair.asmodian && pair.asmodian.characterClassID == classToFilter.id;
          } else {
            return pair.elyo && pair.elyo.characterName && pair.elyo.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0 ||
              pair.asmodian && pair.asmodian.characterName &&  pair.asmodian.characterName.toLowerCase().indexOf(textToSearch.toLowerCase()) >= 0;
          }
        };

        if (classToFilter || textToSearch) {

          $scope.elyosData = serverData.data.elyos.where(filterAndSearchFn).select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.where(filterAndSearchFn).select(_initCharacter);

          $scope.versusData = initialVersusData.where(filterAndSearchInVersus);

        } else {
          $scope.elyosData = serverData.data.elyos.select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.select(_initCharacter);
          $scope.versusData = initialVersusData;
        }

      },500);

    }
  }

})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.main.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME,[
    '$rootScope',main_controller
  ]);


  function main_controller($rootScope) {
    $rootScope._name = CONTROLLER_NAME;

  }

})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('helperService', [
    '$q', helper_service
  ]);


  function helper_service($q) {

    var $this = this;
    $this.$q = {};


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

    $this.$q.all = function(items) {
      return $q.all(items);
    };
  }

})(angular);

(function(ng){
  'use strict';

  ng.module('mainApp').service('storedDataService',[
    '$http', 'helperService', storedData_service
  ]);

  function storedData_service($http, helperService) {

    var $this = this;

    //Wich servers
    $this.serversList = [
      {id : 47, name: 'Alquima'},
      {id : 46, name: 'Anuhart'},
      {id : 39, name: 'Balder'},
      {id : 49, name: 'Barus'},
      {id : 45, name: 'Calindi'},
      {id : 48, name: 'Curatus'},
      {id : 36, name: 'Kromede'},
      {id : 44, name: 'Nexus'},
      {id : 34, name: 'Perento'},
      {id : 31, name: 'Spatalos'},
      {id : 42, name: 'Suthran'},
      {id : 32, name: 'Telemachus'},
      {id : 37, name: 'Thor'},
      {id : 40, name: 'Urtem'},
      {id : 43, name: 'Vehalla'},
      {id : 51, name: 'Zubaba'},
    ];

    //Wich dates we have stored
    $this.storedDates = [
      '07-08-2015',
      '07-09-2015',
      '07-10-2015',
      '07-11-2015',
      '07-12-2015',
      //'07-13-2015',
      '07-14-2015',
      '07-15-2015',
      '07-16-2015',
      '07-17-2015',
    ];

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
      { id: 4, name: 'Assasin', icon: 'img/assassin.jpg' },
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
      var url = 'data/' + date + '/' + serverName + '.json';

      var $$q = helperService.$q.new();
      var sp = $http({
        url: url,
        method: 'GET'
      });

      sp.success(function(data){
        $$q.resolve({
          serverName: serverName,
          date: date,
          data: data
        });
      });

      sp.error($$q.reject);

      return helperService.$q.likeHttp($$q.promise);
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(getLastDate(), serverName);
    };


    function getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

  }

})(angular);