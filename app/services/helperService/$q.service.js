(function(ng) {
  'use strict';

  var SERVICE_NAME = 'helperService.$q';

  var MAIN_TIME_TRIGGER = 1000;

  ng.module('mainApp').service(SERVICE_NAME, ['$injector', _fn]);

  function _fn($injector) {

    var $this = this;
    var $q = $injector.get('$q');
    var $timeout =  $injector.get('$timeout');
    var $parent = null;
    var _timeouts = {};

    //Sets wich is current parent
    $this.$setParent = function(parent) {
      $parent = parent;
      return $this;
    };

    $this.$q = $q;

    //Changes normal promises to be like $http
    $this.$q.likeHttp = function ($$q) {

      //If is a deferred
      if ($$q.promise) {
        $$q.promise.success = function (callback) {
          $$q.promise.then(callback);
          return $$q.promise;
        };
        $$q.promise.error = function (callback) {
          $$q.promise.catch(callback);
          return $$q.promise;
        };
        return $$q;
      }

      //If is a promise
      if ($$q.then) {
        var _$$q = $this.likeHttp($q.defer());

        $$q.then(_$$q.resolve);
        $$q.catch(_$$q.catch);

        return _$$q.promise;
      }
    };

    //Changes $http promises to work like normals
    $this.$q.likeNormal = function (httpPromise) {
      var $$q = $q.defer();
      httpPromise
        .success($$q.resolve)
        .error($$q.reject);
      return $$q.promise;
    };

    //Executes a time trigger
    $this.$q.timeTrigger = function(name, fn, time) {

      //If not time
      if(!time) {
        time = MAIN_TIME_TRIGGER;
      }

      //Cancel previous timeout
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }

      _timeouts[name] = $timeout(fn, time);

      return _timeouts[name];
    };

    //Cancels a time trigger
    $this.$q.cancelTimeTrigger = function(name) {
      if(_timeouts[name]) {
        $timeout.cancel(_timeouts[name]);
      }
    };

  }
})(angular);