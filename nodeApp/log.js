module.exports = new function(){
  'use strict';

  var $this     = this;
  var colors    = require('colors');


  $this.debug = function(msg) {
    var msg = arguments[0];
    var args =  [];
    if(arguments.length > 1) {
      for(var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    console.log.apply(console.log, ['>>'.green + ' ' + msg].concat(args));
  };

  $this.error = function(msg){

    var msg = arguments[0];
    var args =  [];
    if(arguments.length > 1) {
      for(var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    console.log.apply(console.error, ['>>'.red + ' ' + msg].concat(args));
  };

  $this.warn = function(msg){

    var msg = arguments[0];
    var args =  [];
    if(arguments.length > 1) {
      for(var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
    }

    console.warn.apply(console.log, ['>>'.yellow + ' ' + msg].concat(args));
  };

}();
'use strict';
