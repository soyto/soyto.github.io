(function(ng){
  'use strict';

  var DEBUG = false;

  var host = DEBUG ? '' : 'http://91.184.11.238/';

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];
    var _cacheCharacterCheatSheet = null;

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;


    var $this = this;

    //Wich servers
    $this.serversList = [
      {id : 53, name: 'Antriksha'},   //0
      {id : 49, name: 'Barus'},       //1
      {id : 52, name: 'Deyla'},       //2
      {id : 54, name: 'Hellion'},     //3
      {id : 55, name: 'Hyperion'},    //4
      {id : 50, name: 'Loki'},        //5
      {id : 37, name: 'Thor'},        //6
      {id : 40, name: 'Urtem'},       //7

      /* Olds servers distribution
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
       */
    ];

    //Wich dates we have stored
    $this.storedDates = $hs.sortDates($window.storedDates);

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

    //Gets wich is rank of the selected character
    $this.getCharacterRank = function(id) { return $this.characterSoldierRankIds[id]; };

    //Retrieves character classId
    $this.getCharacterClass = function(id) { return $this.characterClassIds[id]; };

    //Retrieves info from the selected server at indicated day
    $this.getFromServer = function(date, serverName) {

      //Try to retrieve cacheItem
      var _cachedItem = _cacheServerData.first(function(itm){
        return itm.serverName == serverName && itm.date == date;
      });

      //If there is some cache item
      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': host + 'data/Servers/' + date + '/' + serverName + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'date': date,
          'data': $data
        };

        //Store on cache
        _cacheServerData.push(_result);

        //return
        return _result;
      });
    };

    //Retrieves last info from the selected server
    $this.getLastFromServer = function(serverName) {
      return $this.getFromServer(_getLastDate(), serverName);
    };

    //Retrieve character info
    $this.getCharacterInfo = function(serverName, characterID) {

      var _cachedItem = _cacheCharacterInfo.first(function(itm){ return itm.serverName == serverName && itm.characterID == characterID; });

      if(_cachedItem) {
        return $q.resolve(_cachedItem);
      }

      return $q.likeNormal($http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      })).then(function($data) {

        var _result = {
          'serverName': serverName,
          'characterID': characterID,
          'data': $data
        };

        _cacheCharacterInfo.push(_result);
        return _result;
      });
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() {
      return _getLastDate();
    };

    //Looks for a character on all servers
    $this.characterSearch = function(text) {

      //Google analytics event track
      $window.ga('send', 'event', 'search_event_category', 'main_search_action', text);

      var _$$textToSearch = text.trim().toLowerCase();

      return _getCharacterCheatSheet().then(function($wholeData) {

        var _result = $wholeData.where(function($$character){
          return $$character['characterName'].toLowerCase().indexOf(_$$textToSearch) >= 0;
        });

        _result.sort(function(a, b){
          var _idxA = a['characterName'].toLowerCase().indexOf(_$$textToSearch);
          var _idxB = b['characterName'].toLowerCase().indexOf(_$$textToSearch);

          if(_idxA === _idxB) {
            var _aLength = a['characterName'].length;
            var _bLength = b['characterName'].length;

            if(_aLength == _bLength) {
              return a['characterName'].toLowerCase().localeCompare(b['characterName'].toLowerCase());
            }

            return _aLength - _bLength;
          }

          return _idxA - _idxB;
        });

        return _result;
      });
    };


    function _getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

    //Gets character cheatSheet
    function _getCharacterCheatSheet() {

      if(_cacheCharacterCheatSheet !== null) {
        return $q.resolve(_cacheCharacterCheatSheet);
      }

      var _url = host + '/data/Servers/Characters/charactersSheet.json';
      return $q.likeNormal($http.get(_url)).then(function($wholeData){
        _cacheCharacterCheatSheet = $wholeData;
        return $wholeData;
      });
    }

  }

})(angular);
