(function(ng){
  'use strict';

  var DIRECTIVE_NAME = 'ngScrollTo';

  ng.module('mainApp').directive(DIRECTIVE_NAME, ['$hs', _fn]);

  function _fn($hs) {


    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');
    var $window = $hs.$instantiate('$window');
    var jQuery = $hs.$instantiate('jQuery');

    function _linkFn($sc, $element, $attr) {

      var _identifier = $attr[DIRECTIVE_NAME];
      var _jElement = jQuery($element);


      $sc.$on(DIRECTIVE_NAME + '.scroll', function(evt, args){

        //Dont same identifier, dont do nothing
        if(typeof(args) == 'string' && args !== _identifier) { return; }
        else if(args['identifier'] !== _identifier){ return; }


        var _parentData = null;
        var _parentElement = null;

        if($attr['parentScroll'] === undefined) {
          _parentElement = jQuery($window.document.body);
          _parentData = {
            'offsetTop': Math.round($window.document.body.offsetTop),
            'scrollTop': Math.round($window.document.body.scrollTop),
            'height': Math.round($window.innerHeight),
            'window': null,
          };
          _parentData['window'] = _parentData['scrollTop'] + _parentData['height'];
        }
        else {
          _parentElement = jQuery.parents($attr['parentScroll']);
          _parentData = {
            'offsetTop': Math.round(_parentElement.offset()['top']),
            'scrollTop': Math.round(_parentElement.scrollTop()),
            'height': Math.round(_parentElement.height()),
            'window': null,
          };
          _parentData['window'] = _parentData['scrollTop'] + _parentData['height'];
        }

        var _elementData = {
          'offsetTop': Math.round(_jElement.offset()['top']),
          'height': Math.round(_jElement.height()),
          'window': null,
          'margin': {
            'top': 0,
            'bottom': 0
          }
        };
        _elementData['window'] = _elementData['offsetTop'] + _elementData['height'];

        if($attr['ngScrollToElementMargin'] !== undefined) {
          var _margin = $sc.$eval($attr['ngScrollToElementMargin']);

          _elementData['margin']['top'] = parseInt(_margin['top']);
          _elementData['margin']['bottom'] = parseInt(_margin['bottom']);
        }

        var _isTopShown1 = _parentData['scrollTop'] <= _elementData['offsetTop'] - _elementData['margin']['top'];
        var _isTopShown2 = _parentData['window'] > _elementData['offsetTop'];
        var _isBottomShown1 = _parentData['scrollTop'] <= _elementData['window'] - _elementData['margin']['top'];
        var _isBottomShown2 = _parentData['window'] > _elementData['window'];

        var _isTopShown = _isTopShown1 && _isTopShown2;
        var _isBottomShown = _isBottomShown1 && _isBottomShown2;
        var _isHeightBiggerThanParent = _parentData['height'] < _elementData['height'];

        var _scrollTop = null;

        //If element is smaller than parent height and we cannot see top or bottom: then we must scroll
        if(!_isHeightBiggerThanParent && (!_isTopShown || !_isBottomShown)) {
          _scrollTop = _scrollToNearest(_parentData, _elementData, parseInt($attr['ngScrollToOffset']));
        }
        else if(_isHeightBiggerThanParent && (!_isTopShown || !_isBottomShown)){
          _scrollTop = _scrollToTop(_elementData);
        }
        else {
          return;
        }


        _parentElement.animate({
          'scrollTop': _scrollTop,
        }, 100, 'swing');
      });


      //Scrolls to top of element
      function _scrollToTop(elementData) {
        return elementData['scrollTop'];
      }

      //Scroll to nearest (Top or bottom)
      function _scrollToNearest(parentData, elementData, offset) {
        var _scrollResult = null;

        //If element is in bottom of scroll
        if(parentData['scrollTop'] < elementData['offsetTop'] - elementData['margin']['top']) {
          _scrollResult = elementData['offsetTop'] - parentData['height'] + elementData['height'] + offset + elementData['margin']['bottom'];
        }
        else { //If is on top
          _scrollResult = elementData['offsetTop'] - offset - elementData['margin']['top'];
        }

        if(_scrollResult < 0) {
          _scrollResult = 0;
        }

        return _scrollResult;
      }
    }


    return {
      'restrict': 'A',
      'link': _linkFn
    };
  }


})(angular);