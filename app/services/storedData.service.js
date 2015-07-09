(function(ng){
  'use strict';

  ng.module('mainApp').service('storedDataService',[
    '$http', 'helperService', storedData_service
  ]);

  function storedData_service($http, helperService) {

    var $this = this;

    //Wich servers
    $this.serversList = {
      'Alquima': '47',
      'Anuhart': '46',
      'Balder': '39',
      'Barus': '49',
      'Calindi': '45',
      'Curatus': '48',
      'Kromede': '36',
      'Nexus': '44',
      'Perento': '34',
      'Spatalos': '31',
      'Suthran': '42',
      'Telemachus': '32',
      'Thor': '37',
      'Urtem': '40',
      'Vehalla': '43',
      'Zubaba': '51'
    };

    //Wich dates we have stored
    $this.storedDates = [
      '07-08-2015',
      '07-09-2015'
    ];

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