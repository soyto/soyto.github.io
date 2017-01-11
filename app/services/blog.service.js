(function(ng){
  'use strict';

  ng.module('mainApp').service('blogService', [
    '$hs', _fn
  ]);


  function _fn($hs) {

    var $log = $hs.$instantiate('$log');
    var $http = $hs.$instantiate('$http');
    var $q = $hs.$q;

    var $this = this;

    var _cachedPosts = null;

    //Retrieves all posts
    $this.getAll = function() {
      if(_cachedPosts !== null) {
        return $q.resolve(_cachedPosts);
      }
      else {
        return $q.likeNormal($http({
          'url': 'data/Posts/posts.json',
          'method': 'GET'
        })).then(function($data) {

          $data = $data.sort(function(a, b) {
            return (new Date(b['date'])).getTime() - (new Date(a['date'])).getTime();
          });

          _cachedPosts = $data;
          return $data;
        });
      }
    };
  }
})(angular);
