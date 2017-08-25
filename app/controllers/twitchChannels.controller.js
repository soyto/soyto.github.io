(function(ng) {
  'use strict';

  var CONTROLLER_NAME = 'mainApp.twitchChannels.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', _fn]);

  function _fn($sc, $hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var characterSocialService = $hs.$instantiate('characterSocialService');
    var twitchService = $hs.$instantiate('twitchService');
    var $window = $hs.$instantiate('$window');
    var $location = $hs.$instantiate('$location');
    var $interval = $hs.$instantiate('$interval');

    var _streamInterval;

    var _data = {
      'streams': [],
      '$$state': {
        'loading': true
      }
    };


    _init();

    /* --------------------------------- SCOPE FUNCTIONS -----------------------------------------------------------  */


    /* --------------------------------- PRIVATE FUNCTIONS ---------------------------------------------------------  */

    //Initialize
    function _init() {
      $sc['_name'] = CONTROLLER_NAME;
      $sc['data'] = _data;

      $hs.$scope.setTitle('Soyto.github.io | Twitch channels');
      $hs.$scope.setNav('twitchChannels');

      characterSocialService.getGithubSocialData().then(function($$data) {

        $$data['characterSocial']
          .where(function(x){ return x['buttons']['twitch'] != null; })
          .forEach(function(x) { _data['streams'].push({
            'character': x,
            'info': null,
            'channel_id': null,
            'channel': null,
            'stream': null,
            'isOnline': false
          }); });


        _setUpStreams().then(function(){
          _data['$$state']['loading'] = false;
        });
      });

    }

    //Set up the streams
    function _setUpStreams() {

      var _$q = $q.resolve();

      //First of all, update channels
      _$q = _$q.then(function() {
        var _$$qs = [];

        _data['streams'].forEach(function($$stream) {
          _$$qs.push(twitchService.getChannel($$stream['character']['buttons']['twitch'].split('/')[3])
            .then(function($$twitchChannel) {
              $$stream['channel'] = $$twitchChannel;
              $$stream['channel_id'] = $$twitchChannel['_id'];

              return storedDataService.getCharacterInfo(
                $$stream['character']['serverName'],
                $$stream['character']['characterID']).then(function($$characterInfo) {
                $$stream['info'] = $$characterInfo;
              });

            }).catch(function($$error) {
              _data['streams'].remove($$stream);
            })
          );
        });

        return $q.all(_$$qs);
      });

      _$q = _$q.then(function() {

        var _twitchChannelIDs = _data['streams']
          .select(function(x){ return x['character']['buttons']['twitch'].split('/')[3]; });

        //Try to know who is online
        return twitchService.getOnlinePeople(_twitchChannelIDs).then(function($$twitchStreams) {

          $$twitchStreams['streams'].forEach(function($$twitchStream) {
            var _streamItm = _data['streams'].first(function(x){ return x['channel_id'] == $$twitchStream['channel']['_id']; });
            _streamItm['channel'] = $$twitchStream['channel'];
            _streamItm['stream'] = $$twitchStream;
            _streamItm['isOnline'] = true;
          });


          //Sort people
          _data['streams'].sort(function(a, b) {

            if(a['isOnline'] && !b['isOnline']){ return -1; }
            if(!a['isOnline'] && b['isOnline']){ return 1; }

            return a['info']['characterName'].localeCompare(b['info']['characterName']);
          });

        });

      });

      return _$q;
    }

    /* --------------------------------- EVENTS FUNCTIONS ----------------------------------------------------------  */

  }
})(angular);