/*
 * Soyto.github.io (0.4.9)
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
window.storedDates = [
 '07-08-2015',
 '07-09-2015',
 '07-10-2015',
 '07-11-2015',
 '07-12-2015',
 '07-14-2015',
 '07-15-2015',
 '07-16-2015',
 '07-17-2015',
 '07-18-2015',
 '07-19-2015',
 '07-20-2015',
 '07-21-2015',
 '07-22-2015',
 '07-23-2015',
 '07-24-2015',
 '07-25-2015',
 '07-26-2015',
 '07-27-2015',
 '07-28-2015',
 '07-29-2015',
 '07-30-2015',
 '07-31-2015',
 '08-01-2015',
 'Characters'
];

(function(ng, navigator){
  'use strict';

  ng.module('mainApp',[
    'ngRoute',
    'angular-loading-bar'
  ]);

  ng.module('mainApp').config(['$routeProvider', configRoutes]);
  ng.module('mainApp').config(['cfpLoadingBarProvider', cfpLoadingBarFn]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
  var isMobile =  IS_MOBILE_REGEX_1.test(navigator.userAgent) || IS_MOBILE_REGEX_2.test(navigator.userAgent.substr(0,4));

  function configRoutes($routeProvider) {

    //Index route
    var indexRouteData = {
      templateUrl: '/app/templates/index.html',
      controller: 'mainApp.index.controller'
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
    var rankingRouteMobileData = {
      templateUrl: '/app/templates/ranking.mobile.html',
      controller: 'mainApp.ranking.list.mobile.controller',
      resolve: {
        serverData: ['helperService', 'storedDataService', '$route', function(helperService, storedDataService, $route) {
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
  }

  function cfpLoadingBarFn(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar  = true;
  }

})(angular, navigator);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'storedDataService', 'helperService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, storedDataService, helperService, characterInfo) {
    $scope._name = CONTROLLER_NAME;

    helperService.$scope.setTitle(characterInfo.serverName + ' -> ' + characterInfo.data.names[characterInfo.data.names.length - 1].characterName);

    var dateSortFn = function(a,b) { return a.date > b.date ? -1 : 1; };

    $scope.serverName = characterInfo.serverName;
    $scope.character = characterInfo.data;

    $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyo';
    $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
    $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

    $scope.character.names = $scope.character.names.sort(dateSortFn);
    $scope.character.status = $scope.character.status.sort(dateSortFn);
    $scope.character.guilds = $scope.character.guilds.sort(dateSortFn);

    $scope.character.status.forEach(function(status){
      status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
    });

  }
})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.characterInfo.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'storedDataService', 'helperService', 'characterInfo', index_controller
  ]);


  function index_controller($scope, storedDataService, helperService, characterInfo) {
    $scope._name = CONTROLLER_NAME;

    helperService.$scope.setTitle(characterInfo.serverName + ' -> ' + characterInfo.data.names[characterInfo.data.names.length - 1].characterName);

    var dateSortFn = function(a,b) { return a.date > b.date ? -1 : 1; };

    $scope.serverName = characterInfo.serverName;
    $scope.character = characterInfo.data;

    $scope.character.raceName = $scope.character.raceID == 1 ? 'Asmodian' : 'Elyo';
    $scope.character.characterClass = storedDataService.getCharacterClass(characterInfo.data.characterClassID);
    $scope.character.soldierRank = storedDataService.getCharacterRank(characterInfo.data.soldierRankID);

    $scope.character.names = $scope.character.names.sort(dateSortFn);
    $scope.character.status = $scope.character.status.sort(dateSortFn);
    $scope.character.guilds = $scope.character.guilds.sort(dateSortFn);

    $scope.character.status.forEach(function(status){
      status.soldierRank = storedDataService.getCharacterRank(status.soldierRankID);
    });

  }
})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', 'helperService', 'storedDataService', index_controller
  ]);


  function index_controller($scope, helperService, storedDataService) {
    $scope._name = CONTROLLER_NAME;
    $scope.servers = storedDataService.serversList;
    $scope.lastServerUpdateData = storedDataService.getLastServerData();

    helperService.$scope.setTitle('Army rank application');

  }
})(angular);

(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.ranking.list.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$location', '$timeout', 'helperService',  'storedDataService', 'serverData', index_controller
  ]);

  function index_controller($scope, $location, $timeout, helperService, storedDataService, serverData) {
    $scope._name = CONTROLLER_NAME;
    var initialVersusData = [];
    var textSearch_timeoutPromise = null;

    _init();

    function _init() {

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);

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

      var filterByName = function(character, txt) {
        return character.characterName && (character.characterName.toLowerCase().indexOf(textToSearch) >= 0 ||
          (character.guildName && character.guildName.toLowerCase().indexOf(textToSearch) >= 0 ));
      };

      var filterByClass = function(character, classToFilter) {
        return character.characterClassID == classToFilter.id;
      };

      var filterAndSearchFn = function(character, txt, classToFilter){
        if(classToFilter && txt) {
          return filterByClass(character, classToFilter) && filterByName(character, txt);
        } else if(classToFilter) {
          return filterByClass(character, classToFilter);
        } else {
          return filterByName(character, txt);
        }
      };

      var filterAndSearchInVersus = function(pair, textToSearch, classToFilter) {

        if(classToFilter && textToSearch) {
          return (pair.elyo && filterByName(pair.elyo, textToSearch) && filterByClass(pair.elyo, classToFilter)) ||
            (pair.asmodian && filterByName(pair.asmodian, textToSearch) && filterByClass(pair.asmodian, classToFilter));
        } else if(classToFilter) {
          return (pair.elyo && filterByClass(pair.elyo, classToFilter)) ||
            (pair.asmodian && filterByClass(pair.asmodian, classToFilter));
        } else {
          return (pair.elyo && filterByName(pair.elyo, textToSearch)) ||
            (pair.asmodian && filterByName(pair.asmodian, textToSearch));
        }
      };

      if(textSearch_timeoutPromise) {
        $timeout.cancel(textSearch_timeoutPromise);
      }

      textSearch_timeoutPromise = $timeout(function() {

        if (classToFilter || textToSearch) {
          $scope.elyosData = serverData.data.elyos.where(function(character) {
            return filterAndSearchFn(character, textToSearch, classToFilter);
          }).select(_initCharacter);
          $scope.asmodianData = serverData.data.asmodians.where(function(character) {
            return filterAndSearchFn(character, textToSearch, classToFilter);
          }).select(_initCharacter);

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

  var CONTROLLER_NAME = 'mainApp.ranking.list.mobile.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, [
    '$scope', '$window',  'storedDataService', 'helperService', 'serverData', index_controller
  ]);

  function index_controller($scope, $window, storedDataService, helperService, serverData) {

    $scope._name = CONTROLLER_NAME;

    _init();


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
      _performFilterAndSearch($scope.selectedClass, $scope.textSearch);
    };

    $scope.clear = function(){
      $scope.textSearch = '';
      $scope.selectedClass = '';
      _performFilterAndSearch('','');
    };

    function _init() {

      helperService.$scope.setTitle(serverData.serverName + ' -> ' + serverData.date);

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


      $scope.filters = {};
      $scope.filters.show = false;

      $scope.page = {
        elyos: {},
        asmodians: {}
      };
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

      var filterByName = function(character, txt) {
        return character.characterName && (character.characterName.toLowerCase().indexOf(textToSearch) >= 0 ||
          (character.guildName && character.guildName.toLowerCase().indexOf(textToSearch) >= 0 ));
      };

      var filterByClass = function(character, classToFilter) {
        return character.characterClassID == classToFilter.id;
      };

      var filterAndSearchFn = function(character, txt, classToFilter){
        if(classToFilter && txt) {
          return filterByClass(character, classToFilter) && filterByName(character, txt);
        } else if(classToFilter) {
          return filterByClass(character, classToFilter);
        } else {
          return filterByName(character, txt);
        }
      };

      $scope.pagination.elyos.currentPage = 0;
      $scope.pagination.asmodians.currentPage = 0;
      $scope.filters.show = false;

      if (classToFilter || textToSearch) {

        $scope.elyosData = _performPagination(serverData.data.elyos.where(function(character) {
          return filterAndSearchFn(character, textToSearch, classToFilter);
        }).select(_initCharacter), $scope.pagination.elyos);
        $scope.asmodianData = _performPagination(serverData.data.asmodians.where(function(character) {
          return filterAndSearchFn(character, textToSearch, classToFilter);
        }).select(_initCharacter), $scope.pagination.asmodians);

      } else {
        $scope.elyosData = _performPagination(serverData.data.elyos.select(_initCharacter), $scope.pagination.elyos);
        $scope.asmodianData = _performPagination(serverData.data.asmodians.select(_initCharacter), $scope.pagination.asmodians);
      }
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

  ng.module('mainApp').service('helperService', [
    '$q', '$rootScope', '$window', helper_service
  ]);

  var IS_MOBILE_REGEX_1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var IS_MOBILE_REGEX_2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

  function helper_service($q, $rootScope, $window) {

    var $this = this;
    $this.$scope = {};
    $this.$q = {};
    $this.navigator = {};

    //Sets page title
    $this.$scope.setTitle = function(value) {
      $rootScope.title = value;
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

  ng.module('mainApp').service('storedDataService',[
    '$http', '$window', 'helperService', storedData_service
  ]);

  function storedData_service($http, $window, helperService) {

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];

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
    $this.storedDates = $window.storedDates;

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
      var url = 'data/Characters/' + serverName + '/' + characterID + '.json';

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

          _cacheServerData.push(result);
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