module.exports = function(grunt) {
  'use strict';

  require('../lib/javascript.extensions.js');
  var moment = require('moment');
  var colors = require('colors');
  var marked = require('marked');

  grunt.registerTask('generate-blog-files', function(){
    var done = this.async();

    //TODO For the moment we are only going to generate one file
    //In a future we must create a complex JSON file with link to another ones (Aka must have pagination)

    //Wich files we have on folder
    var files = grunt.file.expand('_posts/*.md');

    //Foreach file we retrieve a new array
    files = files.select(function(fullFileName){
      var name = fullFileName.split('/');
      name = name[name.length - 1];

      var date = name.split('\.')[0];
      var time = name.split('\.')[1];
      var title = name.split('\.')[2];

      //Retrieve javascript date object
      date = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm').toDate();

      //Remove dash from title
      title = title.replace(/-/g, ' ');

      //We willl save content as it, we aren't going to convert it to HTML
      var content = grunt.file.read(fullFileName);

      return {
        date: date,
        title: title,
        content: content
      };
    });


    //Store all data
    grunt.file.write('data/Posts/posts.json', JSON.stringify(files, null, ' '));
  });
}
