module.exports = function(grunt) {
  'use strict';

  require('../lib/javascript.extensions.js');
  var $q = require('q');
  var semver = require('semver');
  var sh = require('shelljs');

  //Sets the version if no arguments adds a suffix
  grunt.registerTask('version', function(){
    setVersion(this.args[0], this.args[1]);
  });

  //Adds all contents of data folder to git
  grunt.registerTask('git-add-data', function(){
    var result = sh.exec('git add data -v');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Performs commit
  grunt.registerTask('git-commit', function(){

    var msg = grunt.option('message');

    if(!msg) { //Try to retrieve git commit message from config
      msg = grunt.config('git.commit.message');
    }

    var cmd ='';

    if(msg) {
      cmd = 'git commit -a -m "(' + msg + ') (' + grunt.config('pkg.version') + ')"';
    } else {
      cmd = 'git commit -a -m "Canges for version: ' + grunt.config('pkg.version') + '"';
    }

    var result = sh.exec(cmd, {silent:true});

    if(result.code !== 0) {
      grunt.fatal(result.output);
    }
  });

  //Performs push
  grunt.registerTask('git-push', function(){
    var result = sh.exec('git push');

    if(result.code !== 0) {
      grunt.fatal(result.output, {silent:true});
    }
  });

  //Publish the application without increase nothing
  grunt.registerTask('publish', function(){

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'git-commit', 'git-push']);
  });

  //Publish the application as patch
  grunt.registerTask('publish-patch', function(){

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'version:patch', 'git-commit', 'git-push']);
  });

  //Publish the application as minor
  grunt.registerTask('publish-minor', function(){

    var msg = grunt.option('message');

    if(msg) {
      grunt.config('git.commit.message', msg);
    }

    grunt.task.run(['compile', 'version:minor', 'git-commit', 'git-push']);
  });


  /* HELPER FUNCTIONS
   * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   */

  //Sets the version:
  // type: major, minor, patch
  // suffix: whatever suffix u want
  function setVersion(type, suffix) {
    var file = 'package.json';
    var gruntFile = grunt.file.readJSON(file);

    if(type) {
      gruntFile.version = semver.inc(gruntFile.version, type);
    }

    if(suffix) {
      gruntFile.version += '-' + suffix;
    }

    grunt.log.ok('Version set to ' + gruntFile.version.cyan);
    grunt.config('pkg.version', gruntFile.version);
    grunt.file.write(file, JSON.stringify(gruntFile, null, '  '));
  }
};
