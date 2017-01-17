(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'twitchPanel';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var twitchService = $hs.$instantiate('twitchService');
    var $interval = $hs.$instantiate('$interval');

    function _linkFn($sc, $element, $attr) {

      $sc['twitchChannel'] = 'https://www.twitch.tv/evangelion0';

      $sc['isLoading'] = true;
      $sc['streamData'] = null;

      var _twitchId = $sc['twitchChannel'].split('/');
      _twitchId = _twitchId[_twitchId.length - 1];

      //Retrieve channel info
      twitchService.getChannel(_twitchId).then(function($$channelData){
        $sc['channelData'] = $$channelData;
        $log.debug('$$chanelData %o', $$channelData);
      }).then(function(){
        twitchService.getStream(_twitchId).then(function($$stream){
          $sc['channelStream'] = $$stream['stream'];
          $log.debug('$$stream %o', $$stream['stream']);
          $sc['isLoading'] = false;
        });
      });


      //Check channelStream each minute
      var _interval = $interval(function(){
        twitchService.getStream(_twitchId).then(function($$stream){
          $sc['channelStream'] = $$stream['stream'];
        });
      }, 60 * 1000);

      //If scope is going to be destroyed
      $sc.$on('$destroy', function(){
        $interval.cancel(_interval);
      });
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'twitchChannel': '=twitchChannel'
      },
      'templateUrl': '/app/templates/directives/twitchPanel.html'
    };
  }

})(angular);