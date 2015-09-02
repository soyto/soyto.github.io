(function(ng){
  'use strict';

  ng.module('mainApp').directive('fbCommentPlugin', ['$window', function($window)  {
    function createHTML(href, numposts, colorscheme) {
        return '<div class="fb-comments" ' +
                       'data-href="' + href + '" ' +
                       'data-numposts="' + numposts + '" ' +
                       'data-colorsheme="' + colorscheme + '">' +
               '</div>';
    }

    return {
        restrict: 'A',
        scope: {},
        link: function postLink(scope, elem, attrs) {
            attrs.$observe('pageHref', function (newValue) {
                var href        = newValue;
                var numposts    = attrs.numposts    || 5;
                var colorscheme = attrs.colorscheme || 'light';

                elem.html(createHTML(href, numposts, colorscheme));

                if($window.FB) {
                  $window.FB.XFBML.parse(elem[0]);
                }
            });
        }
    };
  }]);

})(angular);
