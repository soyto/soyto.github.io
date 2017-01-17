(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'twitchIsOnline';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var twitchService = $hs.$instantiate('twitchService');
    var $interval = $hs.$instantiate('$interval');

    function _linkFn($sc, $element, $attr) {

      //$sc['twitchChannel'] = 'https://www.twitch.tv/helanyah';

      $sc['isLoading'] = true;
      $sc['streamData'] = null;

      _checkChannel().then(function(){
        $sc['isLoading'] = false;
      });

      var _interval = $interval(function(){
        _checkChannel();
      }, 60* 1000); //Check each minute

      $sc.$on('$destroy', function(){
        $interval.cancel(_interval);
      });

      function _checkChannel() {
        return twitchService.checkOnline($sc['twitchChannel']).then(function($$stream) {
          $sc['streamData'] = $$stream;
        });
      }
    }

    return {
      'restrict': 'A',
      'link': _linkFn,
      'scope': {
        'twitchChannel': '=twitchIsOnline'
      },
      'templateUrl': '/app/templates/directives/twitchIsOnline.html'
    };
  }

})(angular);