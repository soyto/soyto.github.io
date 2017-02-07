module.exports = {

  'crawler': {
    'user-agent': 'soyto.github.io crawler',
  },

  'application': {
    'base-folder': 'data/',
    'posts-folder': '_posts/',
    'app-folder': 'app/',
    'app-files': [
      'app/app.js',
      'app/controllers/characterInfo.controller.js',
      'app/controllers/index.controller.js',
      'app/controllers/ranking.list.controller.js',
      'app/controllers/ranking.list.mobile.controller.js',
      'app/controllers/root.controller.js',
      'app/directives/facebookCommentBox.directive.js',
      'app/directives/ngScrollTo.directive.js',
      'app/directives/twitchPanel.directive.js',
      'app/services/blog.service.js',
      'app/services/characterSocial.service.js',
      'app/services/console.service.js',
      'app/services/helper.service.js',
      'app/services/storedData.service.js',
      'app/services/twitch.service.js',
      'app/services/helperService/$q.service.js'
    ],
    'node-app-files': [
      'nodeApp/application.tasks.js',
      'nodeApp/blog.js',
      'nodeApp/blog.tasks.js',
      'nodeApp/gameforge.server.js',
      'nodeApp/gameforge.server.tasks.js',
    ],
    'concat-dest': 'dst/app.js',
    'uglify-dest': 'dst/app.min.js'
  }
};
