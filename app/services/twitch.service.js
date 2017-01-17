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

    //Checks if a streamer is online
    $this.checkOnline = function(twitchChannel) {
      var _channelId = twitchChannel.split('/');
      _channelId = _channelId[_channelId.length - 1];
      return $q.likeNormal($http({
        'ignoreLoadingBar': true,
        'url': 'https://api.twitch.tv/kraken/streams/' + _channelId,
        'method': 'GET',
        'headers': {
          'client-ID': _CLIENTID
        }
      }));
    };
  }

})(angular);