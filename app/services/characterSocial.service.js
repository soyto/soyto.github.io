(function(ng){
  'use strict';

  ng.module('mainApp').service('characterSocialService',['$hs', _fn]);

  function _fn($hs) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $this = this;

    var _characterSocialCache = null;

    //Retrieve all github social data
    $this.getGithubSocialData = function() {
      return _retrieveGithubServerData();
    };

    //Sets character Social data on a character
    $this.setCharacterSocialData = function(character) {
      return _retrieveGithubServerData().then(function($$characterSocials){
        character['social'] = {};

        //Set pic
        var _characterPic = _searchCharacter($$characterSocials['characterPics'], 'pic', character);
        if(_characterPic) {
          character['pictureURL'] = _characterPic;
        }
        else {
          character['pictureURL'] = '//placehold.it/450X300/DD66DD/EE77EE/?text=' + character['characterName'];
        }

        character['social'] = _searchCharacter($$characterSocials['characterSocial'], 'buttons', character);

        return character;
      });
    };

    //Retrieves githubServerData
    function _retrieveGithubServerData() {

      if(_characterSocialCache !== null) {
        return $q.resolve(_characterSocialCache);
      }

      var _result = {
        'characterPics': null,
        'characterSocial': null
      };

      return $q.likeNormal($http.get('/app/data/characterPics.json')).then(function($characterPics){
        _result['characterPics'] = $characterPics;
        return $q.likeNormal($http.get('/app/data/characterSocial.json')).then(function($characterSocial){
          _result['characterSocial'] = $characterSocial;

          _characterSocialCache = _result;
          return _result;
        });
      });
    }

    //Searchs on a collection for a propName item
    function _searchCharacter(collection, propName, character) {
      var _$$first = collection.first(function($$item){
        return $$item['serverName'] == character['serverName'] && $$item['characterID'] == character['characterID'];
      });

      if(_$$first) {
        return _$$first[propName];
      }
      else {
        return null;
      }
    }

  }

})(angular);
