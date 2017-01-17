(function(ng){
  'use strict';

  var SERVICE_NAME = 'twitchService';
  var _CLIENTID = 'vauqjofyej3848u68hpah3aqjjvjcl';

  ng.module('mainApp').service(SERVICE_NAME,['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');

    var $this = this;

    //Retrieves twitch channel
    $this.getChannel = function(channelId) {
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/channels/' + channelId,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };

    //Checks if a streamer is online
    $this.getStream = function(channelId) {
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/streams/' + channelId,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };
  }

})(angular);