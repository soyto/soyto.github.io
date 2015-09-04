module.exports = function(grunt) {
  'use strict';

  require('../lib/javascript.extensions.js');
  var moment = require('moment');
  var colors = require('colors');
  var marked = require('marked');
  var blog   = require('../nodeApp/blog');


  grunt.registerTask('generate-blog-files', function(){
    blog.generateBlogFiles();
  });
}
