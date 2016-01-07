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
