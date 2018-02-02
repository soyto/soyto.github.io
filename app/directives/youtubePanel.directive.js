(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'youtubePanel';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $interval = $hs.$instantiate('$interval');
    var $youtubeService = $hs.$instantiate('youtubeService');

    function _linkFn($sc, $element, $attr) {

      var _data = {
        'channel': null,
        'videos': [],
        '$$state': {
          'loading': false,
          'visible': false
        }
      };

      $sc['data'] = _data;
      _loadData();



      //Loads data
      function _loadData() {
        var _youtubeChannel = $sc['youtubeChannel'];

        if(_youtubeChannel.indexOf('user/') > 0) {

          _data['$$state']['visible'] = true;
          _data['$$state']['loading'] = true;

          var _username = _youtubeChannel.substr(_youtubeChannel.indexOf('user/') + 5);
          $youtubeService.getChannelFromUser(_username).then(function($$channel) {

            if($$channel == null) { _data['$$state']['visible'] = false; }

            _data['channel'] = _transformChannel($$channel);
            $youtubeService.getLastVideosFromChannel($$channel['id']).then(function($$data) {
              _data['videos'] = $$data.map(_transformVideo);
              _data['$$state']['loading'] = false;
            });
          });
        }
        else if(_youtubeChannel.indexOf('channel/') > 0) {

          _data['$$state']['visible'] = true;
          _data['$$state']['loading'] = true;

          var _channelId = _youtubeChannel.substr(_youtubeChannel.indexOf('channel/') + 8);

          $youtubeService.getChannelFromId(_channelId).then(function($$channel) {

            if($$channel == null) { _data['$$state']['visible'] = false; }

            _data['channel'] = _transformChannel($$channel);
            $youtubeService.getLastVideosFromChannel($$channel['id']).then(function($$data) {
              _data['videos'] = $$data.map(_transformVideo);
              _data['$$state']['loading'] = false;
            });
          });
        }
      }

      function _transformChannel(channel) {
        channel['url'] = 'https://www.youtube.com/channel/' + channel.id;
        return channel;
      }

      function _transformVideo(video) {
        video['url'] = 'https://www.youtube.com/watch?v=' + video.id.videoId;
        video['date'] = new Date(video['snippet']['publishedAt']);
        return video;
      }
    }

    return {
      'restrict': 'E',
      'link': _linkFn,
      'scope': {
        'youtubeChannel': '=youtubeChannel'
      },
      'templateUrl': '/app/templates/directives/youtubePanel.html'
    };
  }

})(angular);