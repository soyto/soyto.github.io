/**
 * Dumb but easy, check if a function is a function
 * @param fn
 * @returns {boolean}
 */
Function.isFunction = function(fn) {
  return !!(fn && fn.constructor && fn.call && fn.apply);
};

Array.convertObjectToArray = function(object, propertyName, propertyValue) {
  if(!propertyName) {
    propertyName = 'propName';
  }

  if(!propertyValue) {
    propertyValue = 'propValue';
  }

  var result = [];

  for(var propName in object) {

    if(!object.hasOwnProperty(propName)) {
      continue;
    }


    var newObj = {};
    newObj[propertyName] = propName;
    newObj[propertyValue] = object[propName];

    result.push(newObj);
  }

  return result;
};


/**
 * Where Fn that will filter items by a selector
 * @param selectorYou know wh
 * @returns {Array}
 */
Array.prototype.where = function(whereFn) {

  if(Function.isFunction(whereFn)) {
    var itms = [];

    this.forEach(function(itm, idx){
      if(whereFn(itm, idx)) {
        itms.push(itm);
      }
    });

    return itms;
  }

  return this;
};

/**
 * Function select
 * @param selectFn
 * @returns {Array}
 */
Array.prototype.select = function(selectFn) {

  if(Function.isFunction(selectFn)) {
    var itms = [];

    this.forEach(function(itm, idx) {
      itms.push(selectFn(itm, idx));
    });

    return itms;
  }

  return this;
};

/**
 * Functional first
 * @param whereFn
 * @returns {*}
 */
Array.prototype.first = function(whereFn){

  if(Function.isFunction(whereFn)){
    var reducedItms = this.where(whereFn);
    if(reducedItms.length > 0) {
      return reducedItms[0];
    } else {
      return null;
    }
  } else {
    if(this.length > 0) {
      return this[0];
    } else {
      return null;
    }
  }
};

/**
 * Checks if collection have any element
 * @param whereFn
 * @returns {boolean}
 */
Array.prototype.any = function(whereFn) {

  if(Function.isFunction(whereFn)) {
    return this.where(whereFn).length > 0;
  }
  return this.length > 0;
};

/**
 * Function toDictionary, retrieves a collection and transform it to an object
 * @param keyFn
 * @param valueFn
 * @returns {{}}
 */
Array.prototype.toDictionary = function(keyFn, valueFn) {

  if(!Function.isFunction(keyFn) || !Function.isFunction(valueFn)) {
    return {};
  }

  var result = {};
  this.forEach(function(itm, idx){

    var key = keyFn(itm, idx);
    var value = valueFn(itm, idx);

    result[key] = value;
  });

  return result;
};

/**
 * Function unique that retrieves unique values
 * @param calcFn
 * @returns {Array}
 */
Array.prototype.unique = function(calcFn, uniqueSelectorFn) {
  /* jshint-W004 */


  if(!uniqueSelectorFn || !Function.isFunction(uniqueSelectorFn)) {

    var result = [];

    this.forEach(function (value) {

      if (Function.isFunction(calcFn)) {
        value = calcFn(value);
      }

      if (result.indexOf(value) == -1) {
        result.push(value);
      }
    });

    return result;
  } else {

    var result = [];

    this.select(calcFn).forEach(function(value) {

      var exists = false;

      for(var i = 0; i < result.length; i++) {
        var value2 = result[i];

        if(uniqueSelectorFn(value, value2)) {
          exists = true;
          break;
        }
      }

      if(!exists) {
        result.push(value);
      }
    });

    return result;

    /* jshint+W004 */
  }
};

/**
 * Retrieves the max value of a collection
 * @param calcFn
 * @returns {*}
 */
Array.prototype.max = function(calcFn) {

  var max, maxItm;

  this.forEach(function(itm, idx) {

    var value = Function.isFunction(calcFn) ? calcFn(itm, idx) : itm;

    if(idx === 0 || value > max) {
      max = value;
      maxItm = itm;
    }
  });

  return maxItm;
};

/**
 * Retrieves the min value of a collection
 * @param calcFn
 * @returns {*}
 */
Array.prototype.min = function(calcFn) {

  var min, minItm;

  this.forEach(function(itm, idx) {

    var value = Function.isFunction(calcFn) ? calcFn(itm, idx) : itm;

    if(idx === 0 || value < min) {
      min = value;
      minItm = itm;
    }
  });

  return minItm;
};
/**
 * Function that take the sum of a Fn as argument
 * @param sumFn
 * @returns {*}
 */
Array.prototype.sum = function(sumFn) {

  var total = 0;

  this.forEach(function(itm, idx){

    var value = Function.isFunction(sumFn) ? sumFn(itm, idx) : itm;

    total += value;
  });

  return total;
};

/**
 * Fn that will take the avg of an argument
 * @param sumFn
 * @returns {*}
 */
Array.prototype.avg = function(sumFn) {
 return this.sum(sumFn) / this.length;
};

//Fn that will empty an array
Array.prototype.empty = function() {
  this.splice(0, this.length);
  return this;
};

//PushAll
Array.prototype.pushAll = function(elements) {

  var $$this = this;
  elements.forEach(function($$element){ $$this.push($$element); });

  return this;
}