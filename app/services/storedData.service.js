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
      '07-09-2015'
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