(function(ng){
  'use strict';

  ng.module('mainApp').directive('ngFbLike', ['$window', function($window)  {


    function _linkFn($sc, $element, $attr) {

      $attr.$observe('pageHref', function (newValue) {
        var _href  = newValue;
        var _layout = $attr['layout'] || 'standard';
        var _action = $attr['action'] || 'like';
        var _showFaces = $attr['showFaces'] || true;

        var _html = _createHTML(_href, _layout, _action, _showFaces);

        $element.empty().append(jQuery(_html));



        if($window.FB) {
          $window.FB.XFBML.parse($element[0]);
        }
      });
    }

    function _createHTML(href, layout, action, showFaces) {
      return '<div class="fb-like" ' +
        'data-href="' + href + '" ' +
        'data-layout="' + layout + '" ' +
        'data-action="' + action + '"' +
        'data-width="100px"' +
        'data-show-faces="' + showFaces + '"></div>';
    }


    return {
      'restrict': 'A',
      'scope': {},
      'link':  _linkFn
    };
  }]);

})(angular);
