(function(ng){
  'use strict';

  var CONTROLLER_NAME = 'mainApp.index.controller';

  ng.module('mainApp').controller(CONTROLLER_NAME, ['$scope', '$hs', 'posts', _fn]);


  function _fn($sc, $hs, posts) {

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $marked = $hs.$instantiate('$marked');
    var storedDataService = $hs.$instantiate('storedDataService');
    var $window = $hs.$instantiate('$window');

    $sc._name = CONTROLLER_NAME;

    $sc.servers = storedDataService.serversList;
    $sc.lastServerUpdateData = storedDataService.getLastServerData();
    $sc.posts = posts.select(function(post){
      post.htmlContent = $marked(post.content);
      return post;
    });

    $sc['searchText'] = '';
    $sc['searchTerm'] = '';
    $sc['searchResults'] = null;
    $sc['searchLoading'] = false;

    //When search text changes...
    $sc.onChange_searchText = function(text){

      //Text empty or less than 3 characters, clear search results
      if(text.trim().length < 3) {
        $sc['searchResults'] = null;
        $q.cancelTimeTrigger('mainApp.index.controller.search');
        return;
      }

      $q.timeTrigger('mainApp.index.controller.search', function(){

        $sc['searchTerm'] = text;
        $sc['searchLoading'] = true;

        //Google analytics event track
        $window.ga('send', 'event', 'search_event_category', 'index_search_action', text);

        return storedDataService.characterSearch(text).then(function($data){
          $sc['searchResults'] = $data;
          $sc['searchLoading'] = false;
        });
      }, 2000);

    };

    //When user press clear on search text
    $sc.clear_searchText = function() {
      $sc['searchText'] = '';
      $sc['searchResults'] = null;
      $q.cancelTimeTrigger('mainApp.index.controller.search');
    };

    $hs.$scope.setTitle('Soyto.github.io');
    $hs.$scope.setNav('home');
  }
})(angular);
