(function(ng){
  'use strict';

  ng.module('mainApp').service('caracterPicsService',[
    '$log', _fn
  ]);

  function _fn($log) {
    var $this = this;

    //Pics for some characters
    var _specialCharacterPics = [
      {'server': 'Hellion', 'id': 326346, 'pic': '//i.imgur.com/bw4UVZu.png'}, //Hellion: Krtn
      {'server': 'Hellion', 'id': 332318, 'pic': '//i.imgur.com/jepRExb.png'}, //Hellion: Jaskier
      {'server': 'Hellion', 'id': 332433, 'pic': '//i.imgur.com/pLeI02V.png'}, //Hellion: Adeee
      {'server': 'Hellion', 'id': 492074, 'pic': '//i.imgur.com/sUTeSYn.png'}, //Hellion: Aryska
      {'server': 'Antriksha', 'id': 503001, 'pic': '//i.imgur.com/4XBIv3P.png'}, //Antriksha: Livo
    ];

    //Sets a character pic
    $this.getCharacterPic = function($characterInfo) {

      var _coincidence = _specialCharacterPics.first(function($$character){
        return $$character['server'] == $characterInfo['serverName'] &&
            $$character['id'] == $characterInfo['characterID'];
      });

      if(_coincidence) {
        return _coincidence['pic'];
      }
      else {
        return '//placehold.it/450X300/DD66DD/EE77EE/?text=' + $characterInfo['data']['characterName'];
      }

    };

  }

})(angular);
