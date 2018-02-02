(function(ng){
  'use strict';

  var SERVICE_NAME = 'youtubeService';
  var API_KEY = 'AIzaSyBonJFDolnHzbdBrQ1hkkEtT1FguT9zU9w';

  ng.module('mainApp').service(SERVICE_NAME,['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $window = $hs.$instantiate('$window');
    var $gapi = $hs.$instantiate('$gapi');

    var _isStarted = false;

    var $this = this;

    function _start() {

      if(_isStarted) { return $q.resolve(); }

      var $$q = $q.defer();

      $gapi.load('client', function() {
        $gapi.client.init({
          'apiKey': API_KEY,
        }).then(function(){
          return $gapi.client.load('https://content.googleapis.com/discovery/v1/apis/youtube/v3/rest');
        }).then(function(){
          _isStarted = true;
          $$q.resolve();
        });
      });


      return $$q.promise;
    }

    //Get last videos from channel
    $this.getLastVideosFromChannel = function(channelId) {
      return _start().then(function() {
        return $gapi.client.youtube.search.list({
          'part': 'id, snippet',
          'channelId': channelId,
          'type': 'video',
          'order': 'date',
          'maxResults': 5
        }).then(function($$response) {
          return $$response['result']['items'];
        });
      });
    };

    //Get channel id from user
    $this.getChannelFromUser = function(username) {
      return _start().then(function() {
        return $gapi.client.youtube.channels.list({
          'part': 'id, snippet, brandingSettings',
          'forUsername': username
        }).then(function($$response) {
          return $$response['result']['items'].length > 0 ? $$response['result']['items'][0] : null;
        });
      });
    };

    //Get channel id from user
    $this.getChannelFromId = function(channelId) {
      return _start().then(function() {
        return $gapi.client.youtube.channels.list({
          'part': 'id, snippet, brandingSettings',
          'id': channelId
        }).then(function($$response) {
          return $$response['result']['items'].length > 0 ? $$response['result']['items'][0] : null;
        });
      });
    };


  }

})(angular);