(function(ng){
  'use strict';

  ng.module('mainApp').service('blogService', [
    '$http', 'helperService', blogService
  ]);


  function blogService($http, helperService) {

    var $this = this;

    var cachedPosts = [];


    $this.getAll = function() {
      var $$q = helperService.$q.new();

      if(cachedPosts.length > 0 ) {
        $$q.resolve(cachedPosts);
      }
      else {
        var sp = $http({
          url: 'data/Posts/posts.json',
          method: 'GET'
        });

        sp.success(function(data){
          data = data.sort(function(a,b){
            return a.date > b. date ? -1 : 1;
          });
          cachedPosts = data;
          $$q.resolve(data);
        });


        sp.error($$q.reject);
      }

      return helperService.$q.likeHttp($$q.promise);
    };
  }
})(angular);
