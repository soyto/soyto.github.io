(function(ng){
  'use strict';

  var DEBUG = false;

  var host = DEBUG ? '' : 'https://soyto.tk/';

  ng.module('mainApp').service('storedDataService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $timeout = $hs.$instantiate('$timeout');
    var characterSocialService = $hs.$instantiate('characterSocialService');
    var $location = $hs.$instantiate('$location');

    var _cacheServerData = [];
    var _cacheCharacterInfo = [];
    var _cacheCharacterCheatSheet = null;

	  $window.$cacheServerData = _cacheServerData;
	  $window.$cacheCharacterInfo = _cacheCharacterInfo;

    var $this = this;

    //who asked to remove his name
    $this.removeOldNames_requests = [
      {'serverName': 'Hellion', 'characterID': 430586}, //Daxking
      {'serverName': 'Deyla', 'characterID': 825556}, //Nyle
      {'serverName': 'Urtem', 'characterID': 1508483}, //Nacka
      {'serverName': 'Hellion', 'characterID': 495423}, //Chetitos
      {'serverName': 'Hyperion', 'characterID': 11600}, //Raynee
      {'serverName': 'Antriksha', 'characterID': 863503}, //Nukey
      {'serverName': 'Antriksha', 'characterID': 642109}, //Yost
      {'serverName': 'Hyperion', 'characterID': 783863}, //Siith
      {'serverName': 'Hellion', 'characterID': 428540}, //Kerberos
      {'serverName': 'Barus', 'characterID': 396287}, //Seyune
      {'serverName': 'Barus', 'characterID': 916298}, //CiuCiuu,
      {'serverName': 'Hyperion', 'characterID': 377330}, //Balonna,
      {'serverName': 'Urtem', 'characterID': 1125512}, //Mipha
      {'serverName': 'Hyperion', 'characterID': 57501},
      {'serverName': 'Loki', 'characterID': 70525}, //Gshee
      {'serverName': 'Deyla', 'characterID': 953168}, //Sylrel
      {'serverName': 'Thor', 'characterID': 1369119}, //Necarunerk
      {'serverName': 'Thor', 'characterID': 1225673}, //Gvnr
      {'serverName': 'Hellion', 'characterID': 612759}, //OjV
      {'serverName': 'Thor', 'characterID': 1369978}, //Sprtmster
      {'serverName': 'Barus', 'characterID': 87465}, //Naki
      {'serverName': 'Loki', 'characterID': 1187322}, //Psyxc
      {'serverName': 'Hellion', 'characterID': 442918}, // Kenae
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Antriksha', 'characterID': 723417}, //Riyuko
      {'serverName': 'Deyla', 'characterID': 1161433}, //Pyirra
      {'serverName': 'Hyperion', 'characterID': 525356}, //Akirawoofametsu
      {'serverName': 'Hellion', 'characterID': 305832}, //Yukasuna
      {'serverName': 'Thor', 'characterID': 1946026}, //Instantflashulti
      {'serverName': 'Thor', 'characterID': 1391505}, //Kiyumah
      {'serverName': 'Deyla', 'characterID': 98839}, //Pupper
      {'serverName': 'Hyperion', 'characterID': 375208}, //Nllll
      {'serverName': 'Barus', 'characterID': 1097587}, //Szarienka 
      {'serverName': 'Loki', 'characterID': 877197}, //Iethal
      {'serverName': 'Antriksha', 'characterID': 920308}, //Myllle
      {'serverName': 'Thor', 'characterID': 2113411}, //Topu
      {'serverName': 'Barus', 'characterID': 9880}, //Flaami
      {'serverName': 'Loki', 'characterID': 1187322}, //Flaami
      {'serverName': 'Hyperion', 'characterID': 857011}, //Nyraaa
      {'serverName': 'Hellion', 'characterID': 457520}, //Xamphu
      {'serverName': 'Loki', 'characterID': 1065721}, //Liinxx
      {'serverName': 'Barus', 'characterID': 822324}, //Dissney
      {'serverName': 'Barus', 'characterID': 1182084}, //Sachma
      {'serverName': 'Antriksha', 'characterID': 696706}, //Nahiki
      {'serverName': 'Loki', 'characterID': 560318}, //Zoai
      {'serverName': 'Barus', 'characterID': 1135327}, //Yorru
      {'serverName': 'Hellion', 'characterID': 584003}, //Guindillera
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Thor', 'characterID': 1135085}, //Auyo
      {'serverName': 'Thor', 'characterID': 1133502}, //Danawhite
      {'serverName': 'Loki', 'characterID': 1065721}, //Futanari
      {'serverName': 'Loki', 'characterID': 536681}, //Nuarihyon
      {'serverName': 'Grendal', 'characterID': 1028}, //Sorcerer
      {'serverName': 'Thor', 'characterID': 2163276}, //Majolie
      {'serverName': 'Thor', 'characterID': 1946026}, //Cremathorio
      {'serverName': 'Hyperion', 'characterID': 392962}, //Upset
      {'serverName': 'Hellion', 'characterID': 1478289}, //Charioce
      {'serverName': 'Deyla', 'characterID': 1163409}, //Gunzblazing
      {'serverName': 'Barus', 'characterID': 332731}, //Akonen
      {'serverName': 'Hyperion', 'characterID': 693206}, //Sistinefibel
      {'serverName': 'Hellion', 'characterID': 427449}, //Qmg
      {'serverName': 'Antriksha', 'characterID': 607628}, //Yukaii
      {'serverName': 'Barus', 'characterID': 58925}, //Yoruchichan
      {'serverName': 'Barus', 'characterID': 710123}, //Minasii
      {'serverName': 'Loki', 'characterID': 713632}, //Zenoya
      {'serverName': 'Thor', 'characterID': 1998102}, //KMI
      {'serverName': 'Barus', 'characterID': 1115780}, //Acidheal
      {'serverName': 'Loki', 'characterID': 567177}, //Hardstylelife
      {'serverName': 'Miren', 'characterID': 40582}, //Heavypanda
      {'serverName': 'Grendal', 'characterID': 70897}, //Qtp
      {'serverName': 'Miren', 'characterID': 3390}, //Pikachu
      {'serverName': 'Hyperion', 'characterID': 672128}, //Eishu
      {'serverName': 'Deyla', 'characterID': 1639577}, //Chntr
      {'serverName': 'Barus', 'characterID': 1157147}, //Meoooow
      {'serverName': 'Barus', 'characterID': 515694}, //Litleshevo 
      {'serverName': 'Loki', 'characterID': 1213346}, //Deqx old name hide
      {'serverName': 'Deyla', 'characterID': 1639627}, //Hugmetight
      {'serverName': 'Barus', 'characterID': 1189738}, //Rnesme
      {'serverName': 'Loki', 'characterID': 1190225}, //Phynn 
    ];

    //Who asked to remove his old guild names
    $this.removeOldGuildNames_requests = [
      {'serverName': 'Hellion', 'characterID': 495423}, //Chetitos
      {'serverName': 'Deyla', 'characterID': 1266763}, //Kaijur
      {'serverName': 'Hyperion', 'characterID': 11600}, //Raynee
      {'serverName': 'Antriksha', 'characterID': 863503}, //Nukey
      {'serverName': 'Hyperion', 'characterID': 783863}, //Siith,
      {'serverName': 'Hellion', 'characterID': 428540}, //Kerberos
      {'serverName': 'Barus', 'characterID': 396287}, //Seyune
      {'serverName': 'Barus', 'characterID': 916298}, //CiuCiuu
      {'serverName': 'Hellion', 'characterID': 612759}, //Turbonugget
      {'serverName': 'Hellion', 'characterID': 499099}, //Pepatheinquin
      {'serverName': 'Urtem', 'characterID': 1125512}, //Mipha
      {'serverName': 'Hyperion', 'characterID': 57501},
      {'serverName': 'Loki', 'characterID': 70525}, //Gshee
      {'serverName': 'Thor', 'characterID': 1369119}, //Necarunerk
      {'serverName': 'Hellion', 'characterID': 612759}, //OjV
      {'serverName': 'Thor', 'characterID': 1225673}, //Gvnr
      {'serverName': 'Thor', 'characterID': 1369978}, //Sprtmster
      {'serverName': 'Barus', 'characterID': 87465}, //Naki
      {'serverName': 'Hellion', 'characterID': 442918}, // Kenae
      {'serverName': 'Thor', 'characterID': 1273074}, //Kumuky
      {'serverName': 'Antriksha', 'characterID': 723417}, //Riyuko
      {'serverName': 'Deyla', 'characterID': 1161433}, //Pyirra
      {'serverName': 'Hyperion', 'characterID': 525356}, //Akirawoofametsu
      {'serverName': 'Hellion', 'characterID': 305832}, //Yukasuna
      {'serverName': 'Thor', 'characterID': 1946026}, //Instantflashulti
      {'serverName': 'Deyla', 'characterID': 953168}, //Sylrel
      {'serverName': 'Hyperion', 'characterID': 375208}, //Nllll
      {'serverName': 'Loki', 'characterID': 877197}, //Iethal
      {'serverName': 'Antriksha', 'characterID': 920308}, //Myllle
      {'serverName': 'Thor', 'characterID': 2113411}, //Topu
      {'serverName': 'Loki', 'characterID': 1187322}, //Justmoe
      {'serverName': 'Hyperion', 'characterID': 857011}, //Nyraaa
      {'serverName': 'Hellion', 'characterID': 457520}, //Xamphu
      {'serverName': 'Grendal', 'characterID': 1028}, //Sorcerer
      {'serverName': 'Loki', 'characterID': 1065721}, //Liinxx
      {'serverName': 'Barus', 'characterID': 822324}, //Dissney
      {'serverName': 'Barus', 'characterID': 1182084}, //Sachma
      {'serverName': 'Loki', 'characterID': 560318}, //Zoai
      {'serverName': 'Barus', 'characterID': 1135327}, //Yorru
      {'serverName': 'Hellion', 'characterID': 584003}, //Guindillera
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Loki', 'characterID': 896961}, //Akyraan
      {'serverName': 'Thor', 'characterID': 1135085}, //Auyo
      {'serverName': 'Thor', 'characterID': 1133502}, //Danawhite
      {'serverName': 'Loki', 'characterID': 1065721}, //Futanari
      {'serverName': 'Loki', 'characterID': 536681}, //Nuarihyon
      {'serverName': 'Hyperion', 'characterID': 392962}, //Upset
      {'serverName': 'Barus', 'characterID': 56391}, //Sicarius
      {'serverName': 'Hellion', 'characterID': 1478289}, //Charioce
      {'serverName': 'Barus', 'characterID': 332731}, //Akonen
      {'serverName': 'Hellion', 'characterID': 427449}, //Qmg
      {'serverName': 'Barus', 'characterID': 58925}, //Yoruchichan
      {'serverName': 'Barus', 'characterID': 710123}, //Minasii
      {'serverName': 'Loki', 'characterID': 713632}, //Zenoya
      {'serverName': 'Thor', 'characterID': 1998102}, //KMI
      {'serverName': 'Thor', 'characterID': 1712628}, //Itsami
      {'serverName': 'Barus', 'characterID': 1115780}, //Acidheal
      {'serverName': 'Loki', 'characterID': 567177}, //Hardstylelife
      {'serverName': 'Miren', 'characterID': 40582}, //Heavypanda
      {'serverName': 'Grendal', 'characterID': 70897}, //Qtp
      {'serverName': 'Miren', 'characterID': 3390}, //Pikachu
      {'serverName': 'Hyperion', 'characterID': 724510}, //Uchiwasasuke
      {'serverName': 'Deyla', 'characterID': 1640322}, //Danawhite
      {'serverName': 'Hyperion', 'characterID': 672128}, //Eishu 
      {'serverName': 'Deyla', 'characterID': 1639577}, //Chntr
      {'serverName': 'Barus', 'characterID': 1157147}, //Meoooow
      {'serverName': 'Barus', 'characterID': 515694}, //Litleshevo 
      {'serverName': 'Hyperion', 'characterID': 724296}, //Rezus
      {'serverName': 'Loki', 'characterID': 1213346}, //Deqx old legion name hide
      {'serverName': 'Deyla', 'characterID': 1639627}, //Hugmetight
      {'serverName': 'Barus', 'characterID': 1189738}, //Rnesme
    ];

    //Wich servers
    $this.serversList = [
      {'id': 53, 'name': 'Antriksha'},    //0
      {'id': 49, 'name': 'Barus'},        //1
      {'id': 52, 'name': 'Deyla'},        //2
      {'id': 54, 'name': 'Hellion'},      //3
      {'id': 55, 'name': 'Hyperion'},     //4
      {'id': 50, 'name': 'Loki'},         //5
      {'id': 37, 'name': 'Thor'},         //6
      {'id': 40, 'name': 'Urtem'},        //7
      //{'id': 56, 'name': 'Grendal'},      //8
      //{'id': 57, 'name': 'Fregion'},      //9
      //{'id': 58, 'name': 'Padmarashka'},  //10
      //{'id': 59, 'name': 'Miren'},        //11
    ];

    //Wich dates we have stored
    $this.storedDates = $hs.sortDates($window.storedDates);

    //Character soldier ranks
    $this.characterSoldierRankIds = [
      { id: 0, name: 'Soldier Rank 10'},
      { id: 1, name: 'Soldier Rank 9'},
      { id: 2, name: 'Soldier Rank 8'},
      { id: 3, name: 'Soldier Rank 7'},
      { id: 4, name: 'Soldier Rank 6'},
      { id: 5, name: 'Soldier Rank 5'},
      { id: 6, name: 'Soldier Rank 4'},
      { id: 6, name: 'Soldier Rank 3'},
      { id: 7, name: 'Soldier Rank 2'},
      { id: 9, name: 'Soldier Rank 1'},
      { id: 10, name: 'Army 1-Star Officer'},   //Pos 701->1000
      { id: 11, name: 'Army 2-Star Officer'},   //Pos 501->700
      { id: 12, name: 'Army 3-Star Officer'},   //Pos 301->500
      { id: 13, name: 'Army 4-Star Officer'},   //Pos 101->300
      { id: 14, name: 'Army 5-Star Officer'},   //Pos 31->100
      { id: 15, name: 'General'},               //Pos 11->30
      { id: 16, name: 'Great general'},         //Pos 4->10
      { id: 17, name: 'Commander'},             //Pos 2->3
      { id: 18, name: 'Governor'},              //Pos 1
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

    //Get character rank by position
    $this.getCharacterRankByPosition = function(position) {

      if(position === 1) { return $this.characterSoldierRankIds[18]; }
      else if(position < 4) { return $this.characterSoldierRankIds[17]; }
      else if(position < 11) { return $this.characterSoldierRankIds[16]; }
      else if(position < 31) { return $this.characterSoldierRankIds[15]; }
      else if(position < 101) { return $this.characterSoldierRankIds[14]; }
      else if(position < 301) { return $this.characterSoldierRankIds[13]; }
      else if(position < 501) { return $this.characterSoldierRankIds[12]; }
      else if(position < 701) { return $this.characterSoldierRankIds[11]; }
      else if(position < 1001) { return $this.characterSoldierRankIds[10]; }
      else { return $this.characterSoldierRankIds[9]; }

    };

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

      return $http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      }).then(function(response){

        response['data']['status'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['names'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        response['data']['guilds'].forEach(function($$item){
          $$item['date'] = _normalizeDateString($$item['date']);
        });

        return _processCharacterInfoData(serverName, response['data']).then(function($$character){
          _cacheCharacterInfo.push($$character);
          return $$character;
        });
      });

      //TODO: Replaced cuz dont works on firefox ^^
      /*return $q.likeNormal($http({
        'url': host + 'data/Servers/Characters/' + serverName + '/' + characterID + '.json',
        'method': 'GET'
      }).then(function(arg1, arg2, arg3){
        console.log(arg1);
        console.log(arg2);
        console.log(arg3);
      })).then(function($data) {
        return _processCharacterInfoData(serverName, $data).then(function($$character){
          _cacheCharacterInfo.push($$character);
          return $$character;
        });
      });*/
    };

    //Retrieves what is the last server data
    $this.getLastServerData = function() { return _getLastDate(); };

    //Get character cheat sheet
    $this.getCharacterCheatSheet = function() {
      return _getCharacterCheatSheet();
    };

    //Looks for a character on all servers
    $this.characterSearch = function(text) {

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

    //Retrieve last date
    function _getLastDate() {
      return $this.storedDates[$this.storedDates.length - 1];
    }

    //Gets character cheatSheet
    function _getCharacterCheatSheet() {

      if(_cacheCharacterCheatSheet !== null) {
        var $$q = $q.defer();
        $timeout(function(){
          $$q.resolve(_cacheCharacterCheatSheet);
        });
        return $$q.promise;
      }

      var _url = host + '/data/Servers/Characters/charactersSheet.json';
      return $q.likeNormal($http.get(_url)).then(function($wholeData){
        $wholeData.forEach(function($$entry){
          $$entry['characterClass'] = $this.getCharacterClass($$entry['characterClassID']);
          $$entry['soldierRank'] = $this.getCharacterRank($$entry['characterSoldierRankID']);
          $$entry['raceName'] = $$entry['characterRaceID'] == 1 ? 'Asmodian' : 'Elyos';
        });

        _cacheCharacterCheatSheet = $wholeData;
        return $wholeData;
      });
    }

    //Process character info data
    function _processCharacterInfoData(serverName, characterInfoData) {
      
      //Create result
      var _result = {
        'serverName': serverName,
        'characterID': characterInfoData['characterID'],
        'characterName': characterInfoData['characterName'],
        'names': characterInfoData['names'],
        'characterClassID': characterInfoData['characterClassID'],
        'characterClass': $this.getCharacterClass(characterInfoData['characterClassID']),
        'raceID': characterInfoData['raceID'],
        'raceName': characterInfoData['raceID'] == 1 ? 'Asmodian' : 'Elyos',
        'guildID': characterInfoData['guildID'],
        'guildName': characterInfoData['guildName'],
        'guilds': characterInfoData['guilds'],
        'gloryPoint': characterInfoData['gloryPoint'],
        'gloryPointChange': characterInfoData['gloryPointChange'],
        'position': characterInfoData['position'],
        'rankingPositionChange': characterInfoData['rankingPositionChange'],
        'soldierRankID': characterInfoData['soldierRankID'],
        'soldierRank': $this.getCharacterRank(characterInfoData['soldierRankID']),
        'status': characterInfoData['status'],
      };

      //Normalize and sort collection dates
      _normalizeCollectionDates(_result['names'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['guilds'], 'date').sort(_dateSortFn('date', 'desc'));
      _normalizeCollectionDates(_result['status'], 'date').sort(_dateSortFn('date', 'desc'));

      //Normalize soldier ranks on each status
      _result['status'].forEach(function($$status) {
        $$status['soldierRank'] = $this.getCharacterRank($$status['soldierRankID']);
      });

      //If user request to remove old names
      $this.removeOldNames_requests.every(function($$request){
        if($$request['serverName'] == _result['serverName'] && $$request['characterID'] == _result['characterID']) {
          _result['names'].splice(1, _result['names'].length - 1);
          return false;
        }
        return true;
      });

      //If user requested to remove old guild names
      $this.removeOldGuildNames_requests.every(function($$request){
        if($$request['serverName'] == _result['serverName'] && $$request['characterID'] == _result['characterID']) {
          _result['guilds'].splice(1, _result['guilds'].length - 1);
          return false;
        }
        return true;
      });

      //Set social data to the character
      return characterSocialService.setCharacterSocialData(_result);
    }

    //Normalize a collection specified on first param on date stored on second param
    function _normalizeCollectionDates(collection, propName) {
      collection.forEach(function($$element) {
        $$element[propName] = new Date($$element[propName]);
      });
      return collection;
    }

    function _dateSortFn(propName, sort) {
      if(sort == 'asc') {
        return function(a, b) {
          return a[propName].getTime() - b[propName].getTime();
        };
      }
      else {
        return function(a, b) {
          return b[propName].getTime() - a[propName].getTime();
        };
      }
    }

    //Normalize the date
    function _normalizeDateString(dateString) {
      var _date = new Date(dateString);

      if(!isNaN(_date.getTime())) {
        return _date;
      }

      var _splitDate = dateString.split('-');

      return new Date(parseInt(_splitDate[2]), parseInt(_splitDate[0]) - 1, parseInt(_splitDate[1]));
    }

  }

})(angular);
