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
      {'server': 'Hellion', 'id': 332318, 'pic': '//i.imgur.com/Sps7YGU.png'}, //Hellion: Jaskier
      {'server': 'Hellion', 'id': 332433, 'pic': '//i.imgur.com/pLeI02V.png'}, //Hellion: Adeee
      {'server': 'Hellion', 'id': 492074, 'pic': '//i.imgur.com/sUTeSYn.png'}, //Hellion: Aryska
      {'server': 'Hellion', 'id': 446570, 'pic': '//i3.kym-cdn.com/photos/images/newsfeed/000/950/041/a8a.jpg'}, //Hellion: Shakku
      {'server': 'Hellion', 'id': 336415, 'pic': '//i.imgur.com/LUOMjpH.png'}, //Hellion: Blackdraco
      {'server': 'Hellion', 'id': 413977, 'pic': '//www.cotilleo.es/wp-content/uploads/2016/10/justin-bieber.jpg'}, //Hellion: Shadowfall
      {'server': 'Hellion', 'id': 987350, 'pic': '//i.imgur.com/FCwJFXM.png'}, //Hellion: Arturomal
      {'server': 'Hellion', 'id': 2213, 'pic': '//i.imgur.com/SE4ehSb.png'}, //Hellion: Symehtry
      {'server': 'Hellion', 'id': 612759, 'pic': '//i.imgur.com/QWV1493.png'}, //Hellion: OliverJv
      {'server': 'Hellion', 'id': 288297, 'pic': '//i.imgur.com/6xyFDTJ.png'}, //Hellion: Yleath
      {'server': 'Hellion', 'id': 547988, 'pic': '//i.giphy.com/9wZMlnM0R06l2.gif'}, //Hellion: Tendeeeeeee
      {'server': 'Hellion', 'id': 430842, 'pic': '//i.giphy.com/NVIowdX8ePh4Y.gif'}, //Hellion: Powatrona
      {'server': 'Hellion', 'id': 361870, 'pic': '//i.imgur.com/JO1aCCa.png'}, //Hellion: Ashuramaru
      {'server': 'Antriksha', 'id': 503001, 'pic': '//i.imgur.com/4XBIv3P.png'}, //Antriksha: Livo
      {'server': 'Antriksha', 'id': 600257, 'pic': '//i.imgur.com/qWxds5G.gif'}, //Antriksha: Lember
      {'server': 'Antriksha', 'id': 457727, 'pic': '//i.imgur.com/FTBKsLO.png'}, //Antriksha: Riborn
      {'server': 'Deyla', 'id': 1236631, 'pic': '//i.imgur.com/fSTG5mc.png'}, //Deyla: Sumie
      {'server': 'Deyla', 'id': 1266763, 'pic': '//i.imgur.com/5rU4kmQ.png'}, //Deyla: Kaijur
      {'server': 'Hellion', 'id': 121280, 'pic': '//i.imgur.com/t5bDYnw.png'}, //Hellion: Sureh
      {'server': 'Antriksha', 'id': 135676, 'pic': '//i.imgur.com/kmxiraq.png'}, //Antriksha: TheKnight...
      {'server': 'Deyla', 'id': 212749, 'pic': '//image.prntscr.com/image/990a0427afed4c32aa0f9f86eaec82f9.png'}, //Deyla: Asgarda
      {'server': 'Barus', 'id': 1026827, 'pic': '//i.hizliresim.com/GP4N96.png'}, //Barus: Ryhmee
      {'server': 'Deyla', 'id': 1071999, 'pic': '//i.imgur.com/EZCWBc7.png'}, //Deyla: Sanko
      {'server': 'Barus', 'id': 939942, 'pic': '//i.imgur.com/ROzAA5O.png'}, //Barus: Mickaya
      {'server': 'Urtem', 'id': 1844317, 'pic': '//i.imgur.com/RmIg33i.png'}, //Urtem: Rjn
      {'server': 'Loki', 'id': 797881, 'pic': '//i.imgur.com/h2MLV9F.png'}, //Loki: Lutetias
      {'server': 'Urtem', 'id': 912505, 'pic': '//i.imgur.com/7ppwteQ.png'}, //Urtem: Ciremia
      {'server': 'Hellion', 'id': 463186, 'pic': '//i.giphy.com/l3vR1MxhtLBKwvVJK.gif'}, //Hellion: Itard
      {'server': 'Antriksha', 'id': 719919, 'pic': '//oi68.tinypic.com/o9g8bp.jpg'}, //Antriksa: Kisuke
    ];

    //Sets a character pic
    $this.getCharacterPic = function($characterInfo) {

      var _coincidence = _specialCharacterPics.first(function($$character){
        return $$character['server'] == $characterInfo['serverName'] && $$character['id'] == $characterInfo['characterID'];
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
