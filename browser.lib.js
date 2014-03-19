require.register('util.polyfill', function(module, exports, require) {
  /**
   * Array.indexOf()
   */
  if (!Array.prototype.indexOf) {
  	Array.prototype.indexOf = function(item) {
  		for (var i = i = 0, n = this.length; i < n; i++) {
  			if (item === this[i]) {
  				return i;
  			}
  		}
  		return -1;
  	};
  }
  
  /**
   * window.requestAnimationFrame()
   */
  var vendors = ['ms', 'moz', 'webkit', 'o']
  	, lastFrameTime = null;
  
  for (var i = 0, n = vendors.length; i < n; i++) {
  	vendor = vendors[i];
  	if (!window.requestAnimationFrame) {
  		window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
  		window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
  	}
  }
  
  if (!window.requestAnimationFrame) {
  	window.requestAnimationFrame = function(callback, element) {
  		var currFrameTime = +(new Date())
  			, id, interval, lastTime;
  		if (lastFrameTime == null) {
  			lastFrameTime = currFrameTime;
  		}
  		interval = Math.max(0, 16 - (currFrameTime - lastFrameTime));
  		id = window.setTimeout((function() {
  			// Call with elapsed frame time
  			callback(currFrameTime + interval);
  		}), interval);
  		lastTime = currFrameTime + interval;
  		return id;
  	};
  }
  
  if (!window.cancelAnimationFrame) {
  	window.cancelAnimationFrame = function(id) {
  		clearTimeout(id);
  	};
  }
  
  
  /**
   * Function.bind()
   * --https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind--
   */
  if (!Function.prototype.bind) {
  	Function.prototype.bind = function(context) {
  		if (typeof this !== 'function') {
  			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
  		}
  		var args = Array.prototype.slice.call(arguments, 1)
  			, toBind = this
  			, noop = function() {}
  			, bound = function() {
  				return toBind.apply(this instanceof noop ? this : context || window,
  					args.concat(Array.prototype.slice.call(arguments)));
  			};
  		noop.prototype = this.prototype;
  		bound.prototype = new noop();
  		return bound;
  	}
  }
  
});
require.register('dom.classlist', function(module, exports, require) {
  require('util.polyfill');
  
  var RE_TRIM = /^\s+|\s+$/g;
  
  /**
   * Check if 'element' has class 'clas'
   * @param {Element} element
   * @param {String} clas
   * @return {Boolean}
   */
  exports.hasClass = function(element, clas) {
  	if (element.classList != null) {
  		return element.classList.contains(clas);
  	} else {
  		var classes = element.className.replace(RE_TRIM, '').split(' ');
  		return classes.indexOf(clas) >= 0;
  	}
  };
  
  /**
   * Check if 'element' has a class matching 'pattern'
   * @param {Element} element
   * @param {String} pattern
   * @return {String}
   */
  exports.matchClass = function(element, pattern) {
  	var classes = element.className.replace(RE_TRIM, '').split(' ')
  		, clas;
  	for (var i = 0, n = classes.length; i < n; i++) {
  		clas = classes[i];
  		if (clas.indexOf(pattern) !== -1) {
  			return clas;
  		}
  	}
  	return '';
  };
  
  /**
   * Add class 'clas' to 'element'
   * @param {Element} element
   * @param {String} clas
   */
  exports.addClass = function(element, clas) {
  	if (element.classList != null) {
  		element.classList.add(clas);
  	} else {
  		element.className += ' ' + clas;
  	}
  };
  
  /**
   * Remove class 'clas' from 'element'
   * @param {Element} element
   * @param {String} clas
   */
  exports.removeClass = function(element, clas) {
  	var c, classes;
  	if (clas) {
  		if (element.classList != null) {
  			element.classList.remove(clas);
  		} else {
  			var classes = element.className.replace(RE_TRIM, '').split(' ')
  				, results = [];
  			for (var i = 0, n = classes.length; i < n; i++) {
  				if (classes[i] !== clas) results.push(classes[i]);
  			}
  			element.className = results.join(' ');
  		}
  	}
  };
  
  /**
   * Toggle class 'clas' on 'element'
   * @param {Element} element
   * @param {String} clas
   */
  exports.toggleClass = function(element, clas) {
  	if (exports.hasClass(element, clas)) {
  		exports.removeClass(element, clas);
  	} else {
  		exports.addClass(element, clas);
  	}
  };
  
  /**
   * Replace class 'clasOld' with 'clasNew' on 'element'
   * @param {Element} element
   * @param {String} clas
   */
  exports.replaceClass = function(element, clasOld, clasNew) {
  	if (clasOld) {
  		if (clasNew) {
  			element.className = element.className.replace(clasOld, clasNew);
  		} else {
  			exports.removeClass(element, clasOld);
  		}
  	} else if (clasNew) {
  		exports.addClass(element, clasNew);
  	}
  };
  
  /**
   * Add class 'clas' to 'element', and remove after 'duration' milliseconds
   * @param {Element} element
   * @param {String} clas
   * @param {Number} duration
   */
  exports.addTemporaryClass = function(element, clas, duration) {
  	exports.addClass(element, clas);
  	setTimeout((function() {
  		exports.removeClass(element, clas);
  	}), duration);
  };
  
});
require.register('lodash._objecttypes', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
  
  module.exports = objectTypes;
  
});
require.register('lodash.isobject', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash._objecttypes');
  
  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }
  
  module.exports = isObject;
  
});
require.register('lodash.isnumber', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var numberClass = '[object Number]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a number.
   *
   * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
   * @example
   *
   * _.isNumber(8.4 * 5);
   * // => true
   */
  function isNumber(value) {
    return typeof value == 'number' ||
      value && typeof value == 'object' && toString.call(value) == numberClass || false;
  }
  
  module.exports = isNumber;
  
});
require.register('lodash.isnan', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNumber = require('lodash.isnumber');
  
  /**
   * Checks if `value` is `NaN`.
   *
   * Note: This is not the same as native `isNaN` which will return `true` for
   * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
   * @example
   *
   * _.isNaN(NaN);
   * // => true
   *
   * _.isNaN(new Number(NaN));
   * // => true
   *
   * isNaN(undefined);
   * // => true
   *
   * _.isNaN(undefined);
   * // => false
   */
  function isNaN(value) {
    // `NaN` as a primitive is the only value that is not equal to itself
    // (perform the [[Class]] check first to avoid errors with some host objects in IE)
    return isNumber(value) && value != +value;
  }
  
  module.exports = isNaN;
  
});
require.register('lodash._isnative', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );
  
  /**
   * Checks if `value` is a native function.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
   */
  function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
  }
  
  module.exports = isNative;
  
});
require.register('lodash.isarray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative');
  
  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
  
  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };
  
  module.exports = isArray;
  
});
require.register('lodash.isstring', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** `Object#toString` result shortcuts */
  var stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('fred');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == stringClass || false;
  }
  
  module.exports = isString;
  
});
require.register('lodash.noop', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * A no-operation function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // no operation performed
  }
  
  module.exports = noop;
  
});
require.register('lodash._basecreate', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      isObject = require('lodash.isobject'),
      noop = require('lodash.noop');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
  
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || global.Object();
      };
    }());
  }
  
  module.exports = baseCreate;
  
});
require.register('lodash._setbinddata', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      noop = require('lodash.noop');
  
  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };
  
  /** Used to set meta data on functions */
  var defineProperty = (function() {
    // IE 8 only accepts DOM elements
    try {
      var o = {},
          func = isNative(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());
  
  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {Array} value The data array to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };
  
  module.exports = setBindData;
  
});
require.register('lodash._slice', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);
  
    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }
  
  module.exports = slice;
  
});
require.register('lodash._basebind', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash._basecreate'),
      isObject = require('lodash.isobject'),
      setBindData = require('lodash._setbinddata'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `_.bind` that creates the bound function and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new bound function.
   */
  function baseBind(bindData) {
    var func = bindData[0],
        partialArgs = bindData[2],
        thisArg = bindData[4];
  
    function bound() {
      // `Function#bind` spec
      // http://es5.github.io/#x15.3.4.5
      if (partialArgs) {
        // avoid `arguments` object deoptimizations by using `slice` instead
        // of `Array.prototype.slice.call` and not assigning `arguments` to a
        // variable as a ternary expression
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      // mimic the constructor's `return` behavior
      // http://es5.github.io/#x13.2.2
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `func`
        var thisBinding = baseCreate(func.prototype),
            result = func.apply(thisBinding, args || arguments);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseBind;
  
});
require.register('lodash._basecreatewrapper', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash._basecreate'),
      isObject = require('lodash.isobject'),
      setBindData = require('lodash._setbinddata'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `createWrapper` that creates the wrapper and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new function.
   */
  function baseCreateWrapper(bindData) {
    var func = bindData[0],
        bitmask = bindData[1],
        partialArgs = bindData[2],
        partialRightArgs = bindData[3],
        thisArg = bindData[4],
        arity = bindData[5];
  
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        key = func;
  
    function bound() {
      var thisBinding = isBind ? thisArg : this;
      if (partialArgs) {
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      if (partialRightArgs || isCurry) {
        args || (args = slice(arguments));
        if (partialRightArgs) {
          push.apply(args, partialRightArgs);
        }
        if (isCurry && args.length < arity) {
          bitmask |= 16 & ~32;
          return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
        }
      }
      args || (args = arguments);
      if (isBindKey) {
        func = thisBinding[key];
      }
      if (this instanceof bound) {
        thisBinding = baseCreate(func.prototype);
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseCreateWrapper;
  
});
require.register('lodash.isfunction', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  
  module.exports = isFunction;
  
});
require.register('lodash._createwrapper', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseBind = require('lodash._basebind'),
      baseCreateWrapper = require('lodash._basecreatewrapper'),
      isFunction = require('lodash.isfunction'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push,
      unshift = arrayRef.unshift;
  
  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new function.
   */
  function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32;
  
    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
      // clone `bindData`
      bindData = slice(bindData);
      if (bindData[2]) {
        bindData[2] = slice(bindData[2]);
      }
      if (bindData[3]) {
        bindData[3] = slice(bindData[3]);
      }
      // set `thisBinding` is not previously bound
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      // set if previously bound but not currently (subsequent curried functions)
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      // set curried arity if not yet set
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      // append partial left arguments
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      // append partial right arguments
      if (isPartialRight) {
        unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      // merge flags
      bindData[1] |= bitmask;
      return createWrapper.apply(null, bindData);
    }
    // fast path for `_.bind`
    var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
    return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
  }
  
  module.exports = createWrapper;
  
});
require.register('lodash.bind', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createWrapper = require('lodash._createwrapper'),
      slice = require('lodash._slice');
  
  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'fred' }, 'hi');
   * func();
   * // => 'hi fred'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
      : createWrapper(func, 1, null, null, thisArg);
  }
  
  module.exports = bind;
  
});
require.register('lodash.identity', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }
  
  module.exports = identity;
  
});
require.register('lodash.support', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative');
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = {};
  
  /**
   * Detect if functions can be decompiled by `Function#toString`
   * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });
  
  /**
   * Detect if `Function#name` is supported (all but IE).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcNames = typeof Function.name == 'string';
  
  module.exports = support;
  
});
require.register('lodash._basecreatecallback', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var bind = require('lodash.bind'),
      identity = require('lodash.identity'),
      setBindData = require('lodash._setbinddata'),
      support = require('lodash.support');
  
  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /** Native method shortcuts */
  var fnToString = Function.prototype.toString;
  
  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early for no `thisArg` or already bound by `Function#bind`
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
      return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
      if (support.funcNames) {
        bindData = !func.name;
      }
      bindData = bindData || !support.funcDecomp;
      if (!bindData) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          bindData = !reFuncName.test(source);
        }
        if (!bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = reThis.test(source);
          setBindData(func, bindData);
        }
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData === false || (bindData !== true && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }
  
  module.exports = baseCreateCallback;
  
});
require.register('lodash.forin', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      objectTypes = require('lodash._objecttypes');
  
  /**
   * Iterates over own and inherited enumerable properties of an object,
   * executing the callback for each property. The callback is bound to `thisArg`
   * and invoked with three arguments; (value, key, object). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * Shape.prototype.move = function(x, y) {
   *   this.x += x;
   *   this.y += y;
   * };
   *
   * _.forIn(new Shape, function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
   */
  var forIn = function(collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable) return result;
    if (!objectTypes[typeof iterable]) return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      for (index in iterable) {
        if (callback(iterable[index], index, collection) === false) return result;
      }
    return result
  };
  
  module.exports = forIn;
  
});
require.register('lodash._arraypool', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to pool arrays and objects used internally */
  var arrayPool = [];
  
  module.exports = arrayPool;
  
});
require.register('lodash._getarray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash._arraypool');
  
  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }
  
  module.exports = getArray;
  
});
require.register('lodash._maxpoolsize', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;
  
  module.exports = maxPoolSize;
  
});
require.register('lodash._releasearray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash._arraypool'),
      maxPoolSize = require('lodash._maxpoolsize');
  
  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }
  
  module.exports = releaseArray;
  
});
require.register('lodash._baseisequal', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var forIn = require('lodash.forin'),
      getArray = require('lodash._getarray'),
      isFunction = require('lodash.isfunction'),
      objectTypes = require('lodash._objecttypes'),
      releaseArray = require('lodash._releasearray');
  
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * The base implementation of `_.isEqual`, without support for `thisArg` binding,
   * that allows partial "_.where" style comparisons.
   *
   * @private
   * @param {*} a The value to compare.
   * @param {*} b The other value to compare.
   * @param {Function} [callback] The function to customize comparing values.
   * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `a` objects.
   * @param {Array} [stackB=[]] Tracks traversed `b` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
    // used to indicate that when comparing objects, `a` has at least the properties of `b`
    if (callback) {
      var result = callback(a, b);
      if (typeof result != 'undefined') {
        return !!result;
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    var type = typeof a,
        otherType = typeof b;
  
    // exit early for unlike primitive values
    if (a === a &&
        !(a && objectTypes[type]) &&
        !(b && objectTypes[otherType])) {
      return false;
    }
    // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
    // http://es5.github.io/#x15.3.4.4
    if (a == null || b == null) {
      return a === b;
    }
    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);
  
    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;
  
      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);
  
      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {
      // unwrap any `lodash` wrapped values
      var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
          bWrapped = hasOwnProperty.call(b, '__wrapped__');
  
      if (aWrapped || bWrapped) {
        return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
      }
      // exit for functions and DOM nodes
      if (className != objectClass) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = a.constructor,
          ctorB = b.constructor;
  
      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB &&
            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
            ('constructor' in a && 'constructor' in b)
          ) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());
  
    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;
  
    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);
  
    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      length = a.length;
      size = b.length;
      result = size == length;
  
      if (result || isWhere) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];
  
          if (isWhere) {
            while (index--) {
              if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                break;
              }
            }
          } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
            break;
          }
        }
      }
    }
    else {
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
        }
      });
  
      if (result && !isWhere) {
        // ensure both objects have the same number of properties
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
    }
    stackA.pop();
    stackB.pop();
  
    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }
  
  module.exports = baseIsEqual;
  
});
require.register('lodash._shimkeys', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash._objecttypes');
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = function(object) {
    var index, iterable = object, result = [];
    if (!iterable) return result;
    if (!(objectTypes[typeof object])) return result;
      for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
          result.push(index);
        }
      }
    return result
  };
  
  module.exports = shimKeys;
  
});
require.register('lodash.keys', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      isObject = require('lodash.isobject'),
      shimKeys = require('lodash._shimkeys');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
  
  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    return nativeKeys(object);
  };
  
  module.exports = keys;
  
});
require.register('lodash.property', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Creates a "_.pluck" style function, which returns the `key` value of a
   * given object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {string} key The name of the property to retrieve.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var characters = [
   *   { 'name': 'fred',   'age': 40 },
   *   { 'name': 'barney', 'age': 36 }
   * ];
   *
   * var getName = _.property('name');
   *
   * _.map(characters, getName);
   * // => ['barney', 'fred']
   *
   * _.sortBy(characters, getName);
   * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
   */
  function property(key) {
    return function(object) {
      return object[key];
    };
  }
  
  module.exports = property;
  
});
require.register('lodash.createcallback', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      baseIsEqual = require('lodash._baseisequal'),
      isObject = require('lodash.isobject'),
      keys = require('lodash.keys'),
      property = require('lodash.property');
  
  /**
   * Produces a callback bound to an optional `thisArg`. If `func` is a property
   * name the created callback will return the property value for a given element.
   * If `func` is an object the created callback will return `true` for elements
   * that contain the equivalent object properties, otherwise it will return `false`.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   * @example
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
   *   return !match ? func(callback, thisArg) : function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(characters, 'age__gt38');
   * // => [{ 'name': 'fred', 'age': 40 }]
   */
  function createCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (func == null || type == 'function') {
      return baseCreateCallback(func, thisArg, argCount);
    }
    // handle "_.pluck" style callback shorthands
    if (type != 'object') {
      return property(func);
    }
    var props = keys(func),
        key = props[0],
        a = func[key];
  
    // handle "_.where" style callback shorthands
    if (props.length == 1 && a === a && !isObject(a)) {
      // fast path the common case of providing an object with a single
      // property containing a primitive value
      return function(object) {
        var b = object[key];
        return a === b && (a !== 0 || (1 / a == 1 / b));
      };
    }
    return function(object) {
      var length = props.length,
          result = false;
  
      while (length--) {
        if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
          break;
        }
      }
      return result;
    };
  }
  
  module.exports = createCallback;
  
});
require.register('lodash.forown', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      keys = require('lodash.keys'),
      objectTypes = require('lodash._objecttypes');
  
  /**
   * Iterates over own enumerable properties of an object, executing the callback
   * for each property. The callback is bound to `thisArg` and invoked with three
   * arguments; (value, key, object). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   console.log(key);
   * });
   * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
   */
  var forOwn = function(collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable) return result;
    if (!objectTypes[typeof iterable]) return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      var ownIndex = -1,
          ownProps = objectTypes[typeof iterable] && keys(iterable),
          length = ownProps ? ownProps.length : 0;
  
      while (++ownIndex < length) {
        index = ownProps[ownIndex];
        if (callback(iterable[index], index, collection) === false) return result;
      }
    return result
  };
  
  module.exports = forOwn;
  
});
require.register('lodash.map', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createCallback = require('lodash.createcallback'),
      forOwn = require('lodash.forown');
  
  /**
   * Creates an array of values by running each element in the collection
   * through the callback. The callback is bound to `thisArg` and invoked with
   * three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `callback` the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is provided for `callback` the created "_.where" style callback
   * will return `true` for elements that have the properties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [callback=identity] The function called
   *  per iteration. If a property name or object is provided it will be used
   *  to create a "_.pluck" or "_.where" style callback, respectively.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array} Returns a new array of the results of each `callback` execution.
   * @example
   *
   * _.map([1, 2, 3], function(num) { return num * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
   * // => [3, 6, 9] (property order is not guaranteed across environments)
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.map(characters, 'name');
   * // => ['barney', 'fred']
   */
  function map(collection, callback, thisArg) {
    var index = -1,
        length = collection ? collection.length : 0;
  
    callback = createCallback(callback, thisArg, 3);
    if (typeof length == 'number') {
      var result = Array(length);
      while (++index < length) {
        result[index] = callback(collection[index], index, collection);
      }
    } else {
      result = [];
      forOwn(collection, function(value, key, collection) {
        result[++index] = callback(value, key, collection);
      });
    }
    return result;
  }
  
  module.exports = map;
  
});
require.register('dom.style', function(module, exports, require) {
  // TODO: handle setting special shortcut transform properties with arrays (translate, scale)?
  
  var isObject = require('lodash.isobject')
  	, isNan = require('lodash.isnan')
  	, isArray = require('lodash.isarray')
  	, isString = require('lodash.isstring')
  	, map = require('lodash.map')
  	, win = window
  	, doc = window.document
  	, el = doc.createElement('div')
  
  		// Hash of unit values
  	, numeric = {
  			'top': 'px',
  			'bottom': 'px',
  			'left': 'px',
  			'right': 'px',
  			'width': 'px',
  			'height': 'px',
  			'margin-top': 'px',
  			'margin-bottom': 'px',
  			'margin-left': 'px',
  			'margin-right': 'px',
  			'padding-top': 'px',
  			'padding-bottom': 'px',
  			'padding-left': 'px',
  			'padding-right': 'px',
  			'border-bottom-left-radius': 'px',
  			'border-bottom-right-radius': 'px',
  			'border-top-left-radius': 'px',
  			'border-top-right-radius': 'px',
   			'transition-duration': 'ms',
   			'opacity': '',
  			'font-size': 'px',
  			'translateX': 'px',
  			'translateY': 'px',
  			'translateZ': 'px',
  			'scaleX': '',
  			'scaleY': '',
  			'scaleZ': '',
  			'rotate': 'deg',
  			'rotateX': 'deg',
  			'rotateY': 'deg',
  			'rotateZ': 'deg',
  			'skewX': 'px',
  			'skewY': 'px'
  		}
  	, colour = {
  			'background-color': true,
  			'color': true,
  			'border-color': true
  		}
  		// Hash of shorthand properties
  	, shorthand = {
  			'border-radius': ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'],
  			'border-color': ['border-bottom-color', 'border-left-color', 'border-top-color', 'border-right-color'],
  			'margin': ['margin-top', 'margin-right', 'margin-left', 'margin-bottom'],
  			'padding': ['padding-top', 'padding-right', 'padding-left', 'padding-bottom']
  		}
  		// Hash of transform properties
  	, transform = {
  			'transform': true,
  			'translate': true,
  			'translateX': true,
  			'translateY': true,
  			'translate3d': true,
  			'translateZ': true,
  			'rotate': true,
  			'rotate3d': true,
  			'rotateX': true,
  			'rotateY': true,
  			'rotateZ': true,
  			'scale': true,
  			'scaleX': true,
  			'scaleY': true,
  			'scale3d': true,
  			'scaleZ': true,
  			'skewX': true,
  			'skewY': true,
  			'perspective': true,
  			'matrix': true,
  			'matrix3d': true
  		}
  
  	, platformStyles = {}
  	, platformPrefix = ''
  
  	, RE_UNITS = /(px|%|em|ms|s|deg)$/
  	, RE_IE_OPACITY = /opacity=(\d+)/i
  	, RE_RGB = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/
  	, RE_MATRIX = /^matrix(?:3d)?\(([^\)]+)/
  	, VENDOR_PREFIXES = ['-webkit-', '-moz-', '-ms-', '-o-']
  	, MATRIX_IDENTITY = [[1, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]]
  	, MATRIX_PROPERTY_INDEX = {
  		translateX: [4,12],
  		translateY: [5,13],
  		translateZ: [null,14],
  		scaleX: [0,0],
  		scaleY: [3,5],
  		scaleZ: [null,10],
  		rotate: [0,0],
  		rotateX: [null,5],
  		rotateY: [null,0],
  		rotateZ: [null,0],
  		skewY: [1,1],
  		skewX: [2,2]
  	};
  
  // Store all possible styles this platform supports
  var s = current(doc.documentElement)
  	, add = function (prop) {
  			platformStyles[prop] = true;
  			// Grab the prefix style
  			if (!platformPrefix && prop.charAt(0) == '-') {
  				platformPrefix = /^-\w+-/.exec(prop)[0];
  			}
  		};
  
  if (s.length) {
  	for (var i = 0, n = s.length; i < n; i++) {
  		add(s[i]);
  	}
  } else {
  	for (var prop in s) {
  		add(prop);
  	}
  }
  
  // Store opacity property name (normalize IE opacity/filter)
  var opacity = !platformStyles['opacity'] && platformStyles['filter'] ? 'filter' : 'opacity';
  
  // API
  exports.isSupported = isSupported;
  exports.getPrefixed = getPrefixed;
  exports.getShorthand = getShorthand;
  exports.getAll = getAll;
  exports.expandShorthand = expandShorthand;
  exports.parseOpacity = parseOpacity;
  exports.getOpacityValue = getOpacityValue;
  exports.parseNumber = parseNumber;
  exports.parseTransform = parseTransform;
  exports.getStyle = getStyle;
  exports.getNumericStyle = getNumericStyle;
  exports.setStyle = setStyle;
  exports.clearStyle = clearStyle;
  exports.platformStyles = platformStyles;
  exports.platformPrefix = platformPrefix;
  // CSS3 feature tests (also forces cache inclusion)
  exports.hasTransitions = isSupported('transition');
  exports.hasTransforms = isSupported('transform');
  exports.has3DTransforms = (function () {
  	if (exports.hasTransforms) {
  		var prop = camelCase(getPrefixed('transform'));
  		el.style[prop] = 'translateZ(10px)';
  		return el.style[prop] != '';
  	}
  	return false;
  })();
  
  /**
   * Determine if 'property' is supported on this platform
   * @returns {Boolean}
   */
  function isSupported (property) {
  	var props = [property, platformPrefix + property]
  		, support = false
  		, prop;
  
  	for (var i = 0, n = props.length; i < n; i++) {
  		prop = props[i];
  		// Use cached
  		if (exports.platformStyles[prop]) return true;
  		if (typeof el.style[prop] === 'string'
  			|| typeof el.style[camelCase(prop)] === 'string') {
  				support = true;
  				exports.platformStyles[prop] = true;
  				break;
  		}
  	}
  
  	return support;
  }
  
  /**
   * Retrieve the vendor prefixed version of the property
   * @param {String} property
   * @returns {String}
   */
  function getPrefixed (property) {
  	if (typeof property === 'string') {
  		// Handle transform pseudo-properties
  		if (transform[property]) {
  			property = 'transform';
  		}
  
  		if (exports.platformStyles[property]) return property;
  
  		if (isSupported(property)) {
  			if (exports.platformStyles[platformPrefix + property]) {
  				property = platformPrefix + property;
  			}
  		}
  	}
  
  	return property;
  }
  
  /**
   * Retrieve a proxy property to use for shorthand properties
   * @param {String} property
   * @returns {String}
   */
  function getShorthand (property) {
  	if (shorthand[property] != null) {
  		return shorthand[property][0];
  	} else {
  		return property;
  	}
  }
  
  /**
   * Retrieve all possible variations of the property
   * @param {String} property
   * @returns {Array}
   */
  function getAll (property) {
  	var all = [];
  
  	// Handle transform pseudo-properties
  	if (transform[property]) {
  		property = 'transform';
  	}
  
  	all.push(property);
  	// Handle shorthands
  	if (shorthand[property]) {
  		all = all.concat(shorthand[property]);
  	}
  	// Automatically add vendor prefix
  	for (var i = 0, n = all.length; i < n; i++) {
  		all.push(platformPrefix + all[i]);
  	}
  
  	return all;
  }
  
  /**
   * Expand shorthand properties
   * @param {String} property
   * @param {Object} value
   * @returns {Object|String}
   */
  function expandShorthand (property, value) {
  	if (shorthand[property] != null) {
  		var props = {};
  		for (var i = 0, n = shorthand[property].length; i < n; i++) {
  			props[shorthand[property][i]] = value;
  		}
  		return props;
  	} else {
  		return property;
  	}
  }
  
  /**
   * Parse current opacity value
   * @param {String} value
   * @returns {Number}
   */
  function parseOpacity (value) {
  	var match;
  	if (value === '') {
  		return null;
  	// IE case
  	} else if (opacity === 'filter') {
  		match = value.match(RE_IE_OPACITY);
  		if (match != null) {
  			return parseInt(match[1], 10) / 100;
  		}
  	} else {
  		return parseFloat(value);
  	}
  }
  
  /**
   * Convert opacity to IE filter syntax
   * @param {String} value
   * @returns {String}
   */
  function getOpacityValue (value) {
  	var val = parseFloat(value);
  	if (opacity === 'filter') {
  		val = "alpha(opacity=" + (val * 100) + ")";
  	}
  	return val;
  }
  
  /**
   * Split a value into a number and unit
   * @param {String} value
   * @param {String} property
   * @returns {Array}
   */
  function parseNumber (value, property) {
  	var channels, num, unit, unitTest;
  
  	if (value == null) {
  		return null;
  	}
  
  	// Handle arrays of values (translate, scale)
  	if (isArray(value)) {
  		return map(value, function (val) {
  			return parseNumber(val, property);
  		});
  	}
  
  	// Handle colours
  	if (colour[property]) {
  		// rgb()
  		if (value != null && value.charAt(0) !== '#') {
  			channels = RE_RGB.exec(value);
  			if (channels) {
  				return ["#" + ((1 << 24) | (channels[1] << 16) | (channels[2] << 8) | channels[3]).toString(16).slice(1), 'hex'];
  			} else {
  				return ['#ffffff', 'hex'];
  			}
  		} else {
  			return [value || '#ffffff', 'hex'];
  		}
  
  	// Handle numbers
  	} else {
  		num = parseFloat(value);
  		if (isNan(num)) {
  			return [value, ''];
  		} else {
  			unitTest = RE_UNITS.exec(value);
  			// Set unit or default
  			unit = (unitTest != null)
  				? unitTest[1]
  				: ((numeric[property] != null)
  						? numeric[property]
  						: 'px');
  			return [num, unit];
  		}
  	}
  }
  
  /**
   * Retrieve a 'property' from a transform 2d or 3d 'matrix'
   * @param {String|Array} matrix
   * @param {String} property
   * @returns {String|Number|Array}
   */
  function parseTransform (matrix, property) {
  	var m = matrixStringToArray(matrix)
  		, is3D = (m && m.length > 6) ? 1 : 0;
  
  	if (m) {
  		switch (property) {
  			case 'matrix':
  			case 'matrix3d':
  				return m;
  			case 'translateX':
  			case 'translateY':
  				return ''
  					+ m[MATRIX_PROPERTY_INDEX[property][is3D]]
  					+ 'px';
  			case 'translateZ':
  				return ''
  					+ (is3D ? m[MATRIX_PROPERTY_INDEX[property][is3D]] : '0')
  					+ 'px';
  			case 'translate':
  				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY')];
  			case 'translate3d':
  				return [parseTransform(matrix, 'translateX'), parseTransform(matrix, 'translateY'), parseTransform(matrix, 'translateZ')];
  			case 'scaleX':
  			case 'scaleY':
  				return m[MATRIX_PROPERTY_INDEX[property][is3D]];
  			case 'scaleZ':
  				return is3D ? m[10] : 1;
  			case 'scale':
  				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY')];
  			case 'scale3d':
  				return [parseTransform(matrix, 'scaleX'), parseTransform(matrix, 'scaleY'), parseTransform(matrix, 'scaleZ')];
  			case 'rotate':
  			case 'rotateY':
  			case 'rotateZ':
  				return ''
  					+ (Math.acos(m[0]) * 180) / Math.PI
  					+ 'deg';
  			case 'rotateX':
  				return ''
  					+ (Math.acos(m[5]) * 180) / Math.PI
  					+ 'deg';
  			case 'skewX':
  				return ''
  					+ (Math.atan(m[2]) * 180) / Math.PI
  					+ 'deg';
  			case 'skewY':
  				return ''
  					+ (Math.atan(m[1]) * 180) / Math.PI
  					+ 'deg';
  		}
  	}
  
  	return matrix;
  }
  
  /**
   * Convert a matrix property to a transform style string
   * Handles existing transforms and special grouped properties
   * @param {Element} element
   * @param {String} property
   * @param {String|Array} value
   * @returns {String}
   */
  function generateTransform (element, property, value) {
  	var matrix = current(element, getPrefixed(property))
  		, m, m1, is3D, idx, len;
  
  	if (matrix == 'none') matrix = '';
  
  	// Reset existing matrix, preserving translations
  	if (matrix) {
  		if (m = matrixStringToArray(matrix)) {
  			is3D = m.length > 6 ? 1 : 0;
  			len = is3D ? 3 : 2;
  			idx = is3D ? 12 : 4;
  			// Preserve translations
  			if (!(~property.indexOf('translate'))) {
  				m1 = MATRIX_IDENTITY[is3D].slice(0, idx)
  					.concat(m.slice(idx, idx + len));
  				if (is3D) m1.push(MATRIX_IDENTITY[is3D].slice(-1));
  				m = m1;
  			// Preserve translations and nullify changed
  			} else {
  				if (property == 'translate' || property == 'translate3d') {
  					m1 = m.slice(0, idx)
  						.concat(MATRIX_IDENTITY[is3D].slice(idx, idx + len));
  					if (is3D) m1.push(m.slice(-1));
  					m = m1;
  				} else if (property == 'translateX' || property == 'translateY' || property == 'translateZ') {
  					idx = MATRIX_PROPERTY_INDEX[property][is3D];
  					if (idx) m[idx] = MATRIX_IDENTITY[is3D][idx];
  				}
  			}
  
  			matrix = is3D ? 'matrix3d' : 'matrix'
  				+ '('
  				+ m.join(', ')
  				+ ') ';
  		}
  	}
  
  	if (numeric[property] != null) {
  		return ''
  			+ matrix
  			+ property
  			+ '('
  			+ value
  			+ ')';
  	// Grouped properties
  	} else {
  		switch (property) {
  			case 'transform':
  			case 'transform3d':
  				return value;
  			case 'matrix':
  			case 'matrix3d':
  				return ''
  					+ property
  					+ '('
  					+ value
  					+ ')';
  			case 'translate':
  			case 'translate3d':
  				if (isArray(value)) {
  					// Add default unit
  					value = map(value, function(item) {
  						return !isString(item) ? item + 'px': item;
  					})
  					.join(', ');
  				}
  				return ''
  					+ matrix
  					+ property
  					+ '('
  					+ value
  					+ ')';
  			case 'scale':
  			case 'scale3d':
  				if (isArray(value)) {
  					value = value.join(', ');
  				}
  				return ''
  					+ matrix
  					+ property
  					+ '('
  					+ value
  					+ ')';
  		}
  	}
  }
  
  /**
   * Retrieve the style for 'property'
   * @param {Element} element
   * @param {String} property
   * @returns {Object}
   */
  function getStyle (element, property) {
  	var prop, value;
  
  	// Special case for opacity
  	if (property === 'opacity') {
  		return parseOpacity(current(element, opacity));
  	}
  
  	// Retrieve longhand and prefixed version
  	prop = getPrefixed(getShorthand(property));
  	value = current(element, prop);
  
  	// Special case for transform
  	if (transform[property]) {
  		return parseTransform(value, property);
  	}
  
  	switch (value) {
  		case '':
  			return null;
  		case 'auto':
  			return 0;
  		default:
  			return value;
  	}
  }
  
  /**
   * Retrieve the numeric value for 'property'
   * @param {Element} element
   * @param {String} property
   * @returns {Number}
   */
  function getNumericStyle (element, property) {
  	return parseNumber(getStyle(element, property), property);
  }
  
  /**
   * Set the style for 'property'
   * @param {Element} element
   * @param {String|Object} property
   * @param {Object} value
   */
  function setStyle (element, property, value) {
  	var prop, matrix;
  
  	// Expand shorthands
  	prop = expandShorthand(property, value);
  	// Handle property hash returned from expandShorthand
  	if (isObject(prop)) {
  		for (var p in prop) {
  			setStyle(element, p, prop[p]);
  		}
  		return;
  	}
  
  	// Handle opacity
  	if (prop === 'opacity') {
  		prop = opacity;
  		value = getOpacityValue(value);
  	}
  
  	// Look up default numeric unit if none provided
  	if (value !== 'auto'
  		&& value !== 'inherit'
  		&& numeric[prop]
  		&& !RE_UNITS.test(value)) {
  			value += numeric[prop];
  	}
  
  	// Look up prefixed property
  	prop = getPrefixed(prop);
  
  	// Handle special transform properties
  	// TODO: bulk multiple transforms?
  	if (transform[property]) {
  		value = generateTransform(element, property, value);
  	}
  
  	element.style[camelCase(prop)] = value;
  }
  
  /**
   * Remove the style for 'property'
   * @param {Element} element
   * @param {String} property
   */
  function clearStyle (element, property) {
  	var style = element.getAttribute('style') || ''
  		, re;
  
  	if (style) {
  		property = getAll(property).join('[\\w-]*|') + '[\\w-]*';
  
  		re = new RegExp('(?:^|\\s)(?:' + property + '):\\s?[^;]+;', 'ig');
  		element.setAttribute('style', style.replace(re, ''));
  	}
  }
  
  /**
   * Retrieve current computed style
   * @param {Element} element
   * @param {String} property
   * @returns {String}
   */
  function current (element, property) {
  	var value;
  
  	if (win.getComputedStyle) {
  		if (property) {
  			value = win.getComputedStyle(element).getPropertyValue(property);
  			// Try with camel casing
  			if (value == null) win.getComputedStyle(element).getPropertyValue(camelCase(property));
  			return value;
  		} else {
  			return win.getComputedStyle(element);
  		}
  	// IE
  	} else {
  		if (property) {
  			value = element.currentStyle[property];
  			// Try with camel casing
  			if (value == null) element.currentStyle[camelCase(property)];
  			return value;
  		} else {
  			return element.currentStyle;
  		}
  	}
  }
  
  /**
   * CamelCase 'str, removing '-'
   * @param {String} str
   * @returns {String}
   */
  function camelCase (str) {
  	// IE requires vendor prefixed values to start with lowercase
  	if (str.indexOf('-ms-') == 0) str = str.slice(1);
  	return str.replace(/-([a-z]|[0-9])/ig, function(all, letter) {
  		return (letter + '').toUpperCase();
  	});
  }
  
  /**
   * Convert 'matrix' to Array
   * @param {String|Array} matrix
   * @returns {Array}
   */
  function matrixStringToArray (matrix) {
  	if (isArray(matrix)) {
  		return matrix;
  	} else if (re = matrix.match(RE_MATRIX)) {
  		// Convert string to array
  		return re[1].split(', ')
  			.map(function (item) {
  				return parseFloat(item);
  			});
  	}
  }
  
});
require.register('util.identify', function(module, exports, require) {
  /**
   * Test if 'obj' is an Array
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isArray = function(obj) {
  	if (Array.isArray) {
  		return Array.isArray(obj);
  	} else {
  		return Object.prototype.toString.call(obj) === '[object Array]';
  	}
  };
  
  /**
   * Test if 'obj' is an Object
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isObject = function(obj) {
  	return obj === Object(obj) && obj.nodeType == undefined;
  };
  
  /**
   * Test if 'obj' is a String
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isString = function(obj) {
  	return Object.prototype.toString.call(obj) === '[object String]';
  };
  
  /**
   * Test if 'obj' is a Number
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isNumber = function(obj) {
  	return Object.prototype.toString.call(obj) === '[object Number]';
  };
  
  /**
   * Test if 'obj' is a Function
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isFunction = function(obj) {
  	return Object.prototype.toString.call(obj) === '[object Function]';
  };
  
  /**
   * Test if 'obj' is NaN
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isNaN = function(obj) {
  	return obj !== obj;
  };
  
  /**
   * Test if 'obj' is an Element
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isElement = function(obj) {
  	return !!((obj != null ? obj.nodeType : null) === 1);
  };
  
  /**
   * Test if 'obj' is a Boolean
   * -- from underscore.js --
   * @param {Object} obj
   * @returns {Boolean}
   */
  exports.isBoolean = function(obj) {
  	return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
  };
  
});
require.register('dom.select', function(module, exports, require) {
  // TODO: add support for live lists?
  // TODO: add support for multiple selectors?
  
  var id = require('util.identify')
  	, win = window
  	, doc = win.document;
  
  /**
   * getElementsByClassName() polyfill
   * @param {String} clas
   * @param {String} tag
   * @returns {Array}
   */
  if (!doc.getElementsByClassName) {
  	doc.getElementsByClassName = function(clas, tag) {
  		var elements = doc.getElementsByTagName(tag || '*')
  			, re = new RegExp("(?:^|\\s)" + clas + "(?:\\s|$)")
  			, results = []
  			, element;
  
  		// Abort if no matches
  		if (!elements.length) { return false; }
  		for (var i = 0, n = elements.length; i < n; i++) {
  			element = elements[i];
  			if (element.className.match(re)) {
  				results.push(element);
  			}
  		}
  		return results;
  	}
  }
  
  /**
   * Retrieve all elements matching 'selector'
   * @params {String} selector
   * @params {Element} context
   * @params {String} tag
   * @returns {Array}
   */
  module.exports = function(selector, context, tag) {
  	var elements, item, sel;
  	if (!id.isElement(context)) {
  		// Retrieve domElement if passed Element instance, otherwise document
  		context = (context != null ? context.domElement : null) || doc;
  	}
  
  	if (context.querySelectorAll != null) {
  		elements = context.querySelectorAll(selector);
  	} else {
  		switch (selector.charAt(0)) {
  			// ID
  			case '#':
  				elements = doc.getElementById(selector.slice(1));
  				break;
  			// Class
  			case '.':
  				elements = doc.getElementsByClassName(selector.slice(1), tag);
  				break;
  			default:
  				// Tag with class (eg. dev.foo)
  				if (selector.indexOf('.') !== -1) {
  					sel = selector.split('.');
  					elements = doc.getElementsByClassName(sel[1], sel[0]);
  				// Tag
  				} else {
  					elements = context.getElementsByTagName(selector);
  				}
  		}
  	}
  
  	if (elements.length) {
  		var results = [];
  		// Convert NodeList to Array
  		for (var i = 0, n = elements.length; i < n; i++) {
  			results.push(elements[i]);
  		}
  		return results;
  	} else {
  		return null;
  	}
  };
  
});
require.register('dom.text', function(module, exports, require) {
  var textProp = document.documentElement.textContent
  	? 'textContent'
  	: 'innerText';
  
  exports.getText = function (element) {
  	return element[textProp];
  };
  
  exports.setText = function (element, text) {
  	element[textProp] = text;
  };
});
require.register('events.event', function(module, exports, require) {
  /**
   * Register for event notification
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.on = function(target, type, callback) {
  	if (!callback) return target;
  
  	if (isElement(target)) {
  		target.addEventListener(type, callback, false);
  	} else {
  		if (target._handlers == null) target._handlers = {};
  		if (!(type in target._handlers)) target._handlers[type] = [];
  		target._handlers[type].push(callback);
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Register for one time event notification
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.once = function(target, type, callback) {
  	var cb;
  
  	// Wrap callback
  	exports.on(target, type, cb = function() {
  		exports.off(target, type, cb);
  		callback.apply(target, arguments);
  	});
  
  	// Chain
  	return target;
  };
  
  /**
   * Unregister for event notification
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.off = function(target, type, callback) {
  	// TODO: remove all handlers by type if no callback?
  
  	if (isElement(target)) {
  		target.removeEventListener(type, callback, false);
  	} else {
  		var handlers;
  		if (target._handlers && (handlers = target._handlers[type])) {
  			for (var i = 0, n = handlers.length; i < n; i++) {
  				if (callback === handlers[i]) {
  					handlers.splice(i, 1);
  					break;
  				}
  			}
  		}
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Unregister all events
   * @param {Object} target
   * @returns {Object}
   */
  exports.offAll = function(target) {
  	if (!isElement(target)) {
  		target._handlers = null;
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Dispatch an event to registered listeners
   * @param {Object} target
   * @param {String|Object} type
   * @param {Object} [data]
   * @returns {Object}
   */
  exports.trigger = function(target, type, data) {
  	var evt, list;
  
  	if (isElement(target)) {
  		evt = document.createEvent('Event');
  		evt.initEvent(type, true, true);
  		evt.data = data;
  		return target.dispatchEvent(evt);
  	} else {
  		// Handle passed in event object
  		if ('object' == typeof type) {
  				evt = type;
  				evt.relatedTarget = evt.target;
  				evt.target = target;
  				type = evt.type;
  		}
  
  		if (target._handlers && type in target._handlers) {
  			evt = evt || {target:target, type:type, data:data};
  			// copy the callback hash to avoid mutation errors
  			list = target._handlers[type].slice();
  			// skip loop if only a single listener
  			if (list.length == 1) {
  				list[0].call(target, evt);
  			} else {
  				for (var i = 0, n = list.length; i < n; i++) {
  					list[i].call(target, evt);
  				}
  			}
  			return true;
  		}
  	}
  	return false;
  };
  
  /**
   * Decorate 'target' with dispatcher behaviour
   * @param {Object} target
   */
  exports.dispatcher = function(target) {
  	target['on'] = function(type, callback) { return exports.on.call(target, target, type, callback); };
  	target['off'] = function(type, callback) { return exports.off.call(target, target, type, callback); };
  	target['one'] = function(type, callback) { return exports.one.call(target, target, type, callback); };
  	target['trigger'] = function(type, data) { return exports.trigger.call(target, target, type, data); };
  };
  
  function isElement (element) {
  	return !!(element
  		&& (element === window
  		|| element.nodeType === 9
  		|| element.nodeType === 1));
  }
  
});
require.register('util.number', function(module, exports, require) {
  exports.TWO_PI = (function() {
  	return Math.PI * 2;
  })();
  
  exports.HALF_PI = (function() {
  	return Math.PI * 0.5;
  })();
  
  /**
   * Converts a given value in degrees to radians
   * @param {Number} deg
   * @returns {Number}
   */
  exports.degreesToRadians = function(deg) {
  	return (deg * Math.PI) / 180;
  };
  
  /**
   * Converts a given value in radians to degrees
   * @param {Number} rad
   * @returns {Number}
   */
  exports.radiansToDegrees = function(rad) {
  	return (180 * rad) / Math.PI;
  };
  
  /**
   * Takes a 'value' within a given range and converts it to a number between 0 and 1.
   * @param {Number} value
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  var normalize = exports.normalize = function(value, min, max) {
  	if (min === max) {
  		return 1;
  	} else {
  		return (value - min) / (max - min);
  	}
  };
  
  /**
   * Takes a normalized value and a range and returns the actual value in that range.
   * @param {Number} normValue
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  var interplate = exports.interpolate = function(normValue, min, max) {
  	return min + (max - min) * normValue;
  };
  
  /**
   * Takes a value in a given range (min1, max1) and finds the corresonding value in the next range (min2, max2).
   * @param {Number} value
   * @param {Number} min1
   * @param {Number} max1
   * @param {Number} min2
   * @param {Number} max2
   * @returns {Number}
   */
  var map = exports.map = function(value, min1, max1, min2, max2) {
  	return interplate(normalize(value, min1, max1), min2, max2);
  };
  
  /**
   * Takes a value and limits it to fall within a given range.
   * @param {Number} value
   * @param {Number} minimum
   * @param {Number} maximum
   * @returns {Number}
   */
  var limit = exports.limit = function(value, min, max) {
  	return Math.min(Math.max(min, value), max);
  };
  
  /**
   * Generates a random number between a given range.
   * @param {Number} low
   * @param {Number} high
   * @returns {Number}
   */
  var rangedRandom = exports.rangedRandom = function(low, high) {
  	return map(Math.random(), 0, 1, low, high);
  };
  
  /**
   * Rounds a value to the number of specified decimal places
   * @param {Number} value
   * @param {Number} decimalPlaces
   * @returns {Number}
   */
  exports.round = function (value, decimalPlaces) {
  	var places = Math.pow(10, (decimalPlaces || 0));
  	return Math.round(value * places) / places;
  };
});
require.register('util.easing', function(module, exports, require) {
  // Based on the infamous Penner easing equations, with css equivalents where possible
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.css = {};
  
  exports.css.linear = 'cubic-bezier(0.250, 0.250, 0.750, 0.750)';
  
  exports.linear = function(t, b, c, d) {
  	return c * t / d + b;
  };
  
  exports.css.inQuad = 'cubic-bezier(0.550, 0.085, 0.680, 0.530)';
  
  exports.inQuad = function(t, b, c, d) {
  	return c * (t /= d) * t + b;
  };
  
  exports.css.outQuad = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
  
  exports.outQuad = function(t, b, c, d) {
  	return -c * (t /= d) * (t - 2) + b;
  };
  
  exports.inOutQuad = function(t, b, c, d) {
  	if ((t /= d / 2) < 1) {
  		return c / 2 * t * t + b;
  	}
  	return -c / 2 * ((--t) * (t - 2) - 1) + b;
  };
  
  exports.css.inCubic = 'cubic-bezier(0.550, 0.055, 0.675, 0.190)';
  
  exports.inCubic = function(t, b, c, d) {
  	return c * (t /= d) * t * t + b;
  };
  
  exports.css.outCubic = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)';
  
  exports.outCubic = function(t, b, c, d) {
  	return c * ((t = t / d - 1) * t * t + 1) + b;
  };
  
  exports.inOutCubic = function(t, b, c, d) {
  	if ((t /= d / 2) < 1) {
  		return c / 2 * t * t * t + b;
  	}
  	return c / 2 * ((t -= 2) * t * t + 2) + b;
  };
  
  exports.css.inQuart = 'cubic-bezier(0.895, 0.030, 0.685, 0.220)';
  
  exports.inQuart = function(t, b, c, d) {
  	return c * (t /= d) * t * t * t + b;
  };
  
  exports.css.outQuart = 'cubic-bezier(0.165, 0.840, 0.440, 1.000)';
  
  exports.outQuart = function(t, b, c, d) {
  	return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  };
  
  exports.css.inOutQuart = 'cubic-bezier(0.770, 0.000, 0.175, 1.000)';
  
  exports.inOutQuart = function(t, b, c, d) {
  	if ((t /= d / 2) < 1) {
  		return c / 2 * t * t * t * t + b;
  	}
  	return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  };
  
  exports.css.inQuint = 'cubic-bezier(0.755, 0.050, 0.855, 0.060)';
  
  exports.inQuint = function(t, b, c, d) {
  	return c * (t /= d) * t * t * t * t + b;
  };
  
  exports.css.outQuint = 'cubic-bezier(0.230, 1.000, 0.320, 1.000)';
  
  exports.outQuint = function(t, b, c, d) {
  	return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  };
  
  exports.css.inOutQuint = 'cubic-bezier(0.860, 0.000, 0.070, 1.000)';
  
  exports.inOutQuint = function(t, b, c, d) {
  	if ((t /= d / 2) < 1) {
  		return c / 2 * t * t * t * t * t + b;
  	}
  	return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  };
  
  exports.css.inSine = 'cubic-bezier(0.470, 0.000, 0.745, 0.715)';
  
  exports.inSine = function(t, b, c, d) {
  	return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  };
  
  exports.css.outSine = 'cubic-bezier(0.390, 0.575, 0.565, 1.000)';
  
  exports.outSine = function(t, b, c, d) {
  	return c * Math.sin(t / d * (Math.PI / 2)) + b;
  };
  
  exports.css.inOutSine = 'cubic-bezier(0.445, 0.050, 0.550, 0.950)';
  
  exports.inOutSine = function(t, b, c, d) {
  	return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  };
  
  exports.css.inExpo = 'cubic-bezier(0.950, 0.050, 0.795, 0.035)';
  
  exports.inExpo = function(t, b, c, d) {
  	if (t === 0) {
  		return b;
  	} else {
  		return c * Math.pow(2, 10 * (t / d - 1)) + b;
  	}
  };
  
  exports.css.outExpo = 'cubic-bezier(0.190, 1.000, 0.220, 1.000)';
  
  exports.outExpo = function(t, b, c, d) {
  	if (t === d) {
  		return b + c;
  	} else {
  		return c * (-Math.pow(2, -10 * t / d) + 1) + b;
  	}
  };
  
  exports.css.inOutExpo = 'cubic-bezier(1.000, 0.000, 0.000, 1.000)';
  
  exports.inOutExpo = function(t, b, c, d) {
  	if (t === 0) {
  		return b;
  	}
  	if (t === d) {
  		return b + c;
  	}
  	if ((t /= d / 2) < 1) {
  		return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  	}
  	return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  };
  
  exports.css.inCirc = 'cubic-bezier(0.600, 0.040, 0.980, 0.335)';
  
  exports.inCirc = function(t, b, c, d) {
  	return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  };
  
  exports.css.outCirc = 'cubic-bezier(0.075, 0.820, 0.165, 1.000)';
  
  exports.outCirc = function(t, b, c, d) {
  	return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  };
  
  exports.css.outCirc = 'cubic-bezier(0.785, 0.135, 0.150, 0.860)';
  
  exports.inOutCirc = function(t, b, c, d) {
  	if ((t /= d / 2) < 1) {
  		return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
  	}
  	return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  };
  
  exports.inElastic = function(t, b, c, d) {
  	var a, p, s;
  	if (t === 0) {
  		return b;
  	}
  	if ((t /= d) === 1) {
  		return b + c;
  	}
  	if (!p) {
  		p = d * .3;
  	}
  	if (!a || a < Math.abs(c)) {
  		a = c;
  		s = p / 4;
  	} else {
  		s = p / (2 * Math.PI) * Math.asin(c / a);
  	}
  	return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  };
  
  exports.outElastic = function(t, b, c, d) {
  	var a, p, s;
  	if (t === 0) {
  		return b;
  	}
  	if ((t /= d) === 1) {
  		return b + c;
  	}
  	if (!p) {
  		p = d * .3;
  	}
  	if (!a || a < Math.abs(c)) {
  		a = c;
  		s = p / 4;
  	} else {
  		s = p / (2 * Math.PI) * Math.asin(c / a);
  	}
  	return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  };
  
  exports.inOutElastic = function(t, b, c, d) {
  	var a, p, s;
  	if (t === 0) {
  		return b;
  	}
  	if ((t /= d / 2) === 2) {
  		return b + c;
  	}
  	if (!p) {
  		p = d * (.3 * 1.5);
  	}
  	if (!a || a < Math.abs(c)) {
  		a = c;
  		s = p / 4;
  	} else {
  		s = p / (2 * Math.PI) * Math.asin(c / a);
  	}
  	if (t < 1) {
  		return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  	}
  	return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  };
  
  exports.css.inBack = 'cubic-bezier(0.600, -0.280, 0.735, 0.045)';
  
  exports.inBack = function(t, b, c, d, s) {
  	if (s != null) {
  		s = 1.70158;
  	}
  	return c * (t /= d) * t * ((s + 1) * t - s) + b;
  };
  
  exports.css.outBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
  
  exports.outBack = function(t, b, c, d, s) {
  	if (s != null) {
  		s = 1.70158;
  	}
  	return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  };
  
  exports.css.inOutBack = 'cubic-bezier(0.680, -0.550, 0.265, 1.550)';
  
  exports.inOutBack = function(t, b, c, d, s) {
  	if (s != null) {
  		s = 1.70158;
  	}
  	if ((t /= d / 2) < 1) {
  		return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  	}
  	return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  };
  
  exports.inBounce = function(t, b, c, d) {
  	return c - exports.outBounce(x, d - t, 0, c, d) + b;
  };
  
  exports.outBounce = function(t, b, c, d) {
  	if ((t /= d) < (1 / 2.75)) {
  		return c * (7.5625 * t * t) + b;
  	} else if (t < (2 / 2.75)) {
  		return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
  	} else if (t < (2.5 / 2.75)) {
  		return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
  	} else {
  		return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
  	}
  };
  
  exports.inOutBounce = function(t, b, c, d) {
  	if (t < d / 2) {
  		return exports.inBounce(x, t * 2, 0, c, d) * .5 + b;
  	}
  	return exports.outBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  };
  
});
require.register('util.animate', function(module, exports, require) {
  var style = require('dom.style')
  	, isFunction = require('lodash.isfunction')
  	, isString = require('lodash.isstring')
  	, win = window
  	, doc = window.document
  
  	, anims = {}
  	, length = 0
  	, pool = []
  	, uid = 1
  	, last = 0
  	, running = false
  
  	, FRAME_RATE = 60
  	, DEFAULT_DURATION = 500
  	, DEFAULT_EASING = require('util.easing').outCubic
  	, POOL_SIZE = 10;
  
  module.exports = animate;
  
  // Populate object pool
  for (var i = 0, n = POOL_SIZE; i < n; i++) {
  	pool.push(new Anim());
  }
  
  /**
   * Retrieve an Anim instance bound to 'target'
   * Set 'keep' to true to prevent cleanup
   * @param {Object} target
   * @param {Boolean} [keep]
   * @returns {Anim}
   */
  function animate (target, keep) {
  	if (!target) return;
  
  	// reuse from the object pool
  	var anim = pool.length ? pool.pop() : new Anim();
  	anim.id = uid++;
  	anim.target = target;
  	anim.keep = (keep != null) ? keep : false;
  	return anim;
  }
  
  /**
   * Add 'anim' to render loop
   * @param {Anim} anim
   */
  function add (anim) {
  	if (!anims[anim.id]) {
  		anims[anim.id] = anim;
  		anim.isRunning = true;
  		length++;
  		// Start if not running
  		if (!running) {
  			running = true;
  			last = Date.now();
  			onTick();
  		}
  	}
  }
  
  /**
   * Remove 'anim' from render loop
   * @param {Anim} anim
   */
  function remove (anim) {
  	if (anim.isRunning) {
  		anim.isRunning = false;
  		anim.isComplete = false;
  		anim.duration = 0;
  		anim.elapsed = 0;
  		anim.delayBefore = 0;
  		anim.delayAfter = 0;
  		anim.tickCallbacks = [];
  		anim.completeCallbacks = [];
  		anim.properties = {};
  		anim.ease = DEFAULT_EASING;
  		anim.usingCssTransitions = false;
  		delete anims[anim.id];
  		length--;
  		// Stop if none active
  		if (!length) running = false;
  	}
  }
  
  /**
   * Destroy 'anim'
   * @param {Anim} anim
   */
  function destroy (anim) {
  	// Check that this is eligible for destruction
  	if (anim.id) {
  		remove(anim);
  		// Reset
  		anim.id = null;
  		anim.target = null;
  		anim.keep = false;
  		pool.push(anim);
  	}
  }
  
  /**
   * Tick handler
   * @param {Number} time
   */
  function onTick (time) {
  	var now = Date.now()
  		, tick = now - last;
  
  	// Store
  	last = now;
  	for (var id in anims) {
  		render(anims[id], tick);
  	}
  	// Loop
  	if (running) win.requestAnimationFrame(onTick);
  }
  
  
  /**
   * Render
   * @param {Anim} anim
   * @param {Number} time
   */
  function render (anim, time) {
  	var props = anim.properties
  		, b, c, callback, callbacks, dur, propObj, value;
  
  	anim.elapsed += time;
  	// Make sure total time does not exceed duration
  	dur = (anim.elapsed < anim.duration)
  		? anim.elapsed
  		: anim.duration;
  
  	// Handle delay before
  	if (anim.delayBefore > 0) {
  		anim.delayBefore -= time;
  		// Round down if under 1 frame
  		if (anim.delayBefore < 16) {
  			anim.delayBefore = 0;
  		}
  	}
  
  	// Update properties
  	if (!anim.isComplete && anim.delayBefore <= 0) {
  		for (var prop in props) {
  			propObj = props[prop];
  			// All types except css transitions
  			if (propObj.type < 4) {
  				b = propObj.start;
  				c = propObj.end - b;
  				value = propObj.current = anim.ease.js(dur, b, c, anim.duration);
  				switch (propObj.type) {
  					case 1:
  						anim.target[prop](value);
  						break;
  					case 2:
  						anim.target[prop] = value;
  						break;
  					case 3:
  						style.setStyle(anim.target, prop, "" + value + propObj.unit);
  				}
  			}
  		}
  	}
  
  	// Call tick callbacks
  	executeCallbacks(anim.tickCallbacks);
  
  	// On complete...
  	if (anim.elapsed >= anim.duration) {
  		anim.isComplete = true;
  
  		// Handle delay after
  		if (anim.delayAfter) {
  			anim.duration += anim.delayAfter;
  			anim.delayAfter = 0;
  		} else {
  			// Remove css transition syntax
  			if (anim.usingCssTransitions) {
  				style.clearStyle(anim.target, 'transition');
  				anim.usingCssTransitions = false;
  			}
  
  			// Reset
  			callbacks = anim.completeCallbacks.slice();
  			(anim.keep) ? remove(anim) : destroy(anim);
  
  			// Trigger callbacks
  			// Delay to allow for GC and cleanup
  			setTimeout(function() {
  				executeCallbacks(callbacks);
  				callbacks = null;
  			}, 0);
  		}
  	}
  };
  
  /**
   * Execute one or more 'callbacks'
   * @param {Array}
   */
  function executeCallbacks (callbacks) {
  	if (callbacks.length) {
  		// Don't loop if only 1
  		if (callbacks.length == 1) {
  			callback = callbacks[0];
  			callback.args
  				?	callback.func.apply(null, callback.args)
  				: callback.func();
  		} else {
  			for (var i = 0, n = callbacks.length; i < n; i++) {
  				callback = callbacks[i];
  				callback.args
  					? callback.func.apply(null, callback.args)
  					: callback.func();
  			}
  		}
  	}
  };
  
  /**
   * Anim class
   */
  function Anim () {
  	this.id = null;
  	this.target = null;
  	this.duration = 0;
  	this.delayBefore = 0;
  	this.delayAfter = 0;
  	this.elapsed = 0;
  	this.properties = {};
  	this.ease = DEFAULT_EASING;
  	this.tickCallbacks = [];
  	this.completeCallbacks = [];
  	this.keep = false;
  	this.isRunning = false;
  	this.isComplete = false;
  	this.usingCssTransitions = false;
  }
  
  /**
   * Animate from existing values to target values
   * @param {Object} properties
   * @param {Number} [duration] (miliseconds)
   * @param {Object} [ease]
   * @returns {Anim}
   */
  Anim.prototype.to = function (properties, duration, ease) {
  	var current, end, p, val, tStyle;
  
  	if (ease) this.ease = ease;
  	if (duration == null) duration = DEFAULT_DURATION;
  	this.duration += duration;
  	this.elapsed = 0;
  	this.properties = {};
  	this.usingCssTransitions = false;
  
  	for (var prop in properties) {
  		val = properties[prop];
  		p = {
  			start: 0,
  			current: 0,
  			end: val,
  			type: 0
  		};
  
  		// Property is a Function
  		if (isFunction(this.target[prop])) {
  			p.start = this.target[prop]();
  			p.type = 1;
  
  		// Property is property
  		} else if (prop in this.target) {
  			p.start = this.target[prop];
  			p.type = 2;
  
  		// Property is css
  		} else {
  			current = style.getNumericStyle(this.target, prop);
  			p.start = current[0];
  
  			// Use ending unit if a string is passed
  			if (isString(val)) {
  				end = style.parseNumber(val, prop);
  				p.unit = end[1];
  				p.end = end[0];
  
  			// Use the current unit if none specified
  			} else {
  				p.unit = current[1];
  				p.end = val;
  			}
  
  			// Use css transitions if available
  			if (style.hasTransitions) {
  				// First set up transition
  				if (!this.usingCssTransitions) {
  					tStyle = 'all ' + this.duration + 'ms';
  					if (ease) tStyle += ' ' + (this.ease.css || DEFAULT_EASING.css);
  					if (this.delayBefore) tStyle += ' ' + this.delayBefore + 'ms';
  					style.setStyle(this.target, {transition: tStyle});
  					this.usingCssTransitions = true;
  				}
  				p.type = 4;
  				style.setStyle(this.target, prop, p.end + p.unit);
  			} else {
  				p.type = 3;
  			}
  		}
  		this.properties[prop] = p;
  	}
  
  	add(this);
  
  	// Chain
  	return this;
  };
  
  /**
   * Delay the start or completion of an animation
   * @param {Number} duration
   */
  Anim.prototype.delay = function (duration) {
  	if (duration != null) {
  		if (!this.isRunning) {
  			this.duration += duration;
  			this.delayBefore = duration;
  			add(this);
  		} else {
  			this.delayAfter = duration;
  		}
  	}
  
  	// Chain
  	return this;
  };
  
  /**
   * Retrieve the value for 'property'
   * @param {String} property
   * @returns {Object}
   */
  Anim.prototype.getProperty = function (property) {
  	if (this.isRunning) {
  		var prop = this.properties[property];
  		return prop != null ? prop.current : null;
  	}
  };
  
  /**
   * Set the 'value' for 'property'
   * @param {String} property
   * @param {Object} value
   */
  Anim.prototype.setProperty = function (property, value) {
  	if (this.isRunning) {
  		var prop = this.properties[property];
  		if (prop != null) prop.end = value;
  		// Set new end target for css transitions
  		if (prop.type == 4) style.setStyle(this.target, property, value);
  	}
  };
  
  /**
   * Register tick callback handler with optional arguments
   * @param {Function} callback
   * @param {...}
   * @returns {Anim}
   */
  Anim.prototype.onTick = function (callback) {
  	var args = (2 <= arguments.length)
  		? Array.prototype.slice.call(arguments, 1)
  		: null;
  	this.tickCallbacks.push({
  		func: callback,
  		args: args
  	});
  
  	// Chain
  	return this;
  };
  
  /**
   * Register complete callback handler with optional arguments
   * @param {Function} callback
   * @param {...}
   * @returns {Anim}
   */
  Anim.prototype.onComplete = function (callback) {
  	var args = (2 <= arguments.length)
  		? Array.prototype.slice.call(arguments, 1)
  		: null;
  	this.completeCallbacks.push({
  		func: callback,
  		args: args
  	});
  
  	// Chain
  	return this;
  };
  
  /**
   * Stop running Anim
   */
  Anim.prototype.stop = function () {
  	if (this.keep) {
  		remove(this)
  		return this;
  	} else {
  		return destroy(this);
  	}
  };
  
  /**
   * Destroy Anim
   */
  Anim.prototype.destroy = function () {
  	destroy(this);
  	return null;
  };
  
});
require.register('dom.element', function(module, exports, require) {
  // var Element, animate, classList, css, doc, elementFactory, elements, event, id, numberUtils, objectUtils, select, text, win;
  
  var classList = require('dom.classlist')
  	, select = require('dom.select')
  	, text = require('dom.text')
  	, css = require('dom.style')
  	, event = require('events.event')
  	, identify = require('util.identify')
  	, numberUtils = require('util.number')
  	, animate = require('util.animate')
  	, win = window
  	, doc = win.document
  	, elements = []
  	, id = 0;
  
  /**
   * Element instance factory
   * @param {DOMElement} domElement
   * @returns {Element}
   */
  function elementFactory(domElement) {
  	var el, item;
  	// Retrieve from cache
  	for (var i = 0, n = elements.length; i < n; i++) {
  		item = elements[i];
  		if (item.domElement === domElement) {
  			return item;
  		}
  	}
  	el = new Element(domElement);
  	elements.push(el);
  	return el;
  };
  
  /**
   * Create new Element instances based on 'selector'
   * @param {String} selector
   * @param {Object} context
   * @param {String} tag
   * @returns {Array}
   */
  module.exports = function(selector, context, tag) {
  	var element, results;
  	if (context == null) context = doc;
  	// Retrieve dom element(s) if passed a selector string
  	if (identify.isString(selector)) {
  		selector = select(selector, context, tag);
  	// Error if not passed dom element or array
  	} else if (!(identify.isElement(selector) || identify.isArray(selector))) {
  		return null;
  	}
  
  	// Return array of Elements
  	if (identify.isArray(selector)) {
  		results = [];
  		for (var i = 0, n = selector.length; i < n; i++) {
  			element = selector[i];
  			if (identify.isElement(element)) {
  				results.push(elementFactory(element));
  			}
  		}
  		return results;
  	// Return a single Element if passed a DOM Element
  	} else if (selector != null) {
  		return elementFactory(selector);
  	} else {
  		return null;
  	}
  };
  
  /**
   * Element class
   * @param {DOMElement} domElement
   */
  function Element(domElement) {
  	this.domElement = domElement;
  	this.anim = null;
  	this.id = this.domElement.id;
  	this._id = id++;
  	this.tagName = this.domElement.tagName;
  }
  
  /**
   * Retrieve width
   * @returns {Number}
   */
  Element.prototype.getWidth = function() {
  	return this.domElement.offsetWidth;
  };
  
  /**
   * Set width
   * @param {Number} value
   */
  Element.prototype.setWidth = function(value) {
  	if (value != null) {
  		this.setStyle('width', value);
  		if (this.domElement.width != null) {
  			this.domElement.width = value;
  		}
  	}
  	// Chain
  	return this;
  };
  
  /**
   * Retrieve height
   * @returns {Number}
   */
  Element.prototype.getWidth = function() {
  	return this.domElement.offsetHeight;
  };
  
  /**
   * Set height
   * @param {Number} value
   */
  Element.prototype.height = function(value) {
  	if (value != null) {
  		this.setStyle('height', value);
  		if (this.domElement.height != null) {
  			this.domElement.height = value;
  		}
  	}
  	return this;
  };
  
  /**
   * Retrieve opacity
   * @returns {Number}
   */
  Element.prototype.getOpacity = function() {
  	return this.getStyle('opacity');
  };
  
  /**
   * Set opacity
   * @param {Number} value
   */
  Element.prototype.setOpacity = function(value) {
  	if (value != null) {
  		this.setStyle('opacity', numberUtils.limit(parseFloat(value), 0, 1));
  	}
  	return this;
  };
  
  /**
   * Retrieve offset from parent
   * @returns {Object}
   */
  Element.prototype.getOffset = function() {
  	return {
  		top: this.domElement.offsetTop,
  		left: this.domElement.offsetLeft
  	};
  };
  
  /**
   * Retrieve global position
   * @returns {Object}
   */
  Element.prototype.getPosition = function() {
  	var top = this.domElement.offsetTop
  		, left = this.domElement.offsetLeft
  		, el;
  	if ((el = this.domElement).offsetParent) {
  		while ((el = el.offsetParent)) {
  			top += el.offsetTop;
  			left += el.offsetLeft;
  		}
  	}
  	return {
  		top: top,
  		left: left
  	};
  };
  
  /**
   * @see classList.hasClass
   */
  Element.prototype.hasClass = function(clas) {
  	return classList.hasClass(this.domElement, clas);
  };
  
  /**
   * @see classList.matchClass
   */
  Element.prototype.matchClass = function(clas) {
  	return classList.matchClass(this.domElement, clas);
  };
  
  /**
   * @see classList.addClass
   */
  Element.prototype.addClass = function(clas) {
  	classList.addClass(this.domElement, clas);
  	return this;
  };
  
  /**
   * @see classList.removeClass
   */
  Element.prototype.removeClass = function(clas) {
  	classList.removeClass(this.domElement, clas);
  	return this;
  };
  
  /**
   * @see classList.toggleClass
   */
  Element.prototype.toggleClass = function(clas) {
  	classList.toggleClass(this.domElement, clas);
  	return this;
  };
  
  /**
   * @see classList.replaceClass
   */
  Element.prototype.replaceClass = function(clasOld, clasNew) {
  	classList.replaceClass(this.domElement, clasOld, clasNew);
  	return this;
  };
  
  /**
   * @see classList.addTemporaryClass
   */
  Element.prototype.addTemporaryClass = function(clas, duration) {
  	classList.addTemporaryClass(this.domElement, clas, duration);
  	return this;
  };
  
  /**
   * @see text.getText
   */
  Element.prototype.getText = function() {
  	return text.getText(this.domElement);
  };
  
  /**
   * @see text.setText
   */
  Element.prototype.setText = function(value) {
  	text.setText(this.domElement, value);
  	return this;
  };
  
  /**
   * Retrieve innerHTML
   * @returns {String}
   */
  Element.prototype.getHTML = function() {
  	return this.domElement.innerHTML;
  };
  
  /**
   * Set innerHTML
   * @param {String} value
   */
  Element.prototype.setHTML = function(value) {
  	this.domElement.innerHTML = value;
  	return this;
  };
  
  /**
   * @see css.getStyle
   */
  Element.prototype.getStyle = function(property) {
  	return css.getStyle(this.domElement, property);
  };
  
  /**
   * @see css.getNumericStyle
   */
  Element.prototype.getNumericStyle = function(property) {
  	return css.getNumericStyle(this.domElement, property);
  };
  
  /**
   * @see css.setStyle
   */
  Element.prototype.setStyle = function(property, value) {
  	css.setStyle(this.domElement, property, value);
  	return this;
  };
  
  /**
   * @see css.clearStyle
   */
  Element.prototype.clearStyle = function(property) {
  	css.clearStyle(this.domElement, property);
  	return this;
  };
  
  /**
   * @see event.on
   */
  Element.prototype.on = function(type, callback, data) {
  	event.on(this, type, callback, data);
  	return this;
  };
  
  /**
   * @see event.off
   */
  Element.prototype.off = function(type, callback) {
  	event.off(this, type, callback);
  	return this;
  };
  
  /**
   * @see event.one
   */
  Element.prototype.one = function(type, callback, data) {
  	event.one(this, type, callback, data);
  	return this;
  };
  
  /**
   * @see animate
   */
  Element.prototype.animate = function() {
  	if (!this.anim) this.anim = animate(this.domElement, true);
  	return this.anim
  };
  
  /**
   * Retrieve attribute
   * @param {String} type
   * @returns {String}
   */
  Element.prototype.getAttribute = function(type) {
  	return this.domElement.getAttribute(type);
  };
  
  /**
   * Set attribute
   * @param {String} type
   * @param {String} value
   */
  Element.prototype.setAttribute = function(type, value) {
  	this.domElement.setAttribute(type, value);
  	return this;
  };
  
  /**
   * Retrieve child elements matching 'selector'
   * @param {String} selector
   * @returns {Array}
   */
  Element.prototype.find = function(selector) {
  	return module.exports(selector, this);
  };
  
  /**
   * Retrieve parent element
   * @param {Boolean} asElement
   * @returns {DOMElement or Element}
   */
  Element.prototype.parent = function(asElement) {
  	if (asElement == null) asElement = true;
  	return asElement ? new Element(this.domElement.parentNode) : this.domElement.parentNode;
  };
  
  /**
   * Retrieve children
   * @param {Boolean} asElement
   * @returns {Array}
   */
  Element.prototype.children = function(asElement) {
  	var nodes = this.domElement.childNodes
  		, results = []
  		, child;
  	if (asElement == null) asElement = true;
  	for (var i = 0, n = nodes.length; i < n; i++) {
  		child = nodes[i];
  		if (child && child.nodeType === 1) {
  			results.push(asElement ? new Element(child) : child);
  		}
  	}
  	return results;
  };
  
  /**
   * Retrieve first child
   * @param {Boolean} asElement
   * @returns {DOMElement or Element}
   */
  Element.prototype.firstChild = function(asElement) {
  	if (asElement == null) asElement = true;
  	return asElement ? new Element(this.domElement.firstChild) : this.domElement.firstChild;
  };
  
  /**
   * Retrieve last child
   * @param {Boolean} asElement
   * @returns {DOMElement or Element}
   */
  Element.prototype.lastChild = function(asElement) {
  	if (asElement == null) asElement = true;
  	return asElement ? new Element(this.domElement.lastChild) : this.domElement.lastChild;
  };
  
  /**
   * Append child
   * @param {DOMElement or Element} element
   */
  Element.prototype.appendChild = function(element) {
  	return this.domElement.appendChild(element.domElement || element);
  };
  
  /**
   * Remove child
   * @param {DOMElement or Element} element
   */
  Element.prototype.removeChild = function(element) {
  	return this.domElement.removeChild(element.domElement || element);
  };
  
  /**
   * Replace child
   * @param {DOMElement or Element} newElement
   * @param {DOMElement or Element} oldElement
   */
  Element.prototype.replaceChild = function(newElement, oldElement) {
  	this.domElement.replaceChild(newElement.domElement || newElement, oldElement.domElement || oldElement);
  	return oldElement;
  };
  
  /**
   * Remove from parent
   */
  Element.prototype.remove = function() {
  	return this.parent().removeChild(this.domElement);
  };
  
  /**
   * Insert 'element' before 'referenceElement'
   * @param {DOMElement or Element} element
   * @param {DOMElement or Element} referenceElement
   */
  Element.prototype.insertBefore = function(element, referenceElement) {
  	return this.domElement.insertBefore(element.domElement || element, referenceElement.domElement || referenceElement);
  };
  
  /**
   * Clone element
   * @param {Boolean} deep
   * @param {Boolean} asElement
   */
  Element.prototype.clone = function(deep, asElement) {
  	if (asElement == null) asElement = true;
  	return asElement ? new Element(this.domElement.clone(deep)) : this.domElement.clone(deep);
  };
  
  /**
   * Destroy element and optionally remove from parent
   * @param {Boolean} remove
   */
  Element.prototype.destroy = function(remove) {
  	if (remove == null) remove = false;
  	event.offAll(this);
  	// Setting keep to false will trigger destroy automatically
  	if (this.anim != null) {
  		if (this.anim.isRunning) {
  			this.anim.keep = false;
  		} else {
  			this.anim.destroy();
  		}
  		this.anim = null;
  	}
  	if (remove) {
  		this.domElement.parentNode.removeChild(this.domElement);
  	}
  	// Remove from DOM
  	this.domElement = null;
  	// Remove from cache
  	for (var i = 0, n = elements.length; i < n; i++) {
  		if (elements[idx] === this) {
  			elements.splice(i, 1);
  		}
  		break;
  	}
  };
  
});
require.register('dom.ready', function(module, exports, require) {
  /*
   * Register for DOM ready events
   */
  var win = window
  	, doc = win.document
  	, scrollHackTimer = null
  	, isReady = false
  	, initialized = false
  	, readyCallbacks = [];
  
  function whenReady() {
  	if (!isReady) {
  		isReady = true;
  		// Execute callbacks
  		for (var i = 0, n = readyCallbacks.length; i < n; i++) {
  			readyCallbacks[i]();
  		}
  		readyCallbacks = null;
  		if (scrollHackTimer) {
  			clearTimeout(scrollHackTimer);
  		}
  		// Remove listeners
  		if (doc.addEventListener) {
  			doc.removeEventListener('DOMContentLoaded', whenReady, false);
  			win.removeEventListener('load', whenReady, false);
  		} else {
  			doc.detachEvent('onreadystatechange', whenReady);
  			win.detachEvent('onload', whenReady);
  		}
  	}
  };
  
  // IE scroll hack
  function scrollCheck() {
  	if (isReady) return;
  	try {
  		doc.documentElement.doScroll('left');
  	} catch (error) {
  		scrollHackTimer = setTimeout(scrollCheck, 11);
  		return;
  	}
  	whenReady();
  };
  
  /**
   * Register a function to be called when the DOM is ready
   * param {Function} callback
   */
  module.exports = function(callback) {
  	readyCallbacks.push(callback);
  
  	// Initialize
  	if (!initialized) {
  		// Already loaded
  		if (doc.readyState === 'complete' || doc.readyState === 'loaded') {
  			whenReady();
  		// Initialize watchers
  		} else if (doc.addEventListener) {
  			doc.addEventListener('DOMContentLoaded', whenReady, false);
  			// Just in case previoius doesn't fire
  			win.addEventListener('load', whenReady, false);
  		// IE fallbacks
  		} else if (doc.attachEvent) {
  			doc.attachEvent('onreadystatechange', whenReady);
  			win.attachEvent('onload', whenReady);
  			// Test if already loaded
  			if (doc.documentElement.doScroll) {
  				scrollCheck();
  			}
  		}
  		initialized = true;
  	}
  };
  
});
require.register('env.capabilities', function(module, exports, require) {
  var win = window
  	, doc = win.document
  	, nav = navigator;
  
  /**
   * Does platform support native video
   * @returns {Boolean}
   */
  exports.hasVideo = function() {
  	var hasVideo = !!doc.createElement('video').canPlayType;
  	exports.hasVideo = function() { return hasVideo; };
  	return hasVideo;
  };
  
  /**
   * Does platform support Flash plugin
   * @returns {Boolean}
   */
  exports.hasFlash = function() {
  	var desc, testObject, version;
  	if (nav.plugins != null && nav.plugins['Shockwave Flash'] === 'object') {
  		desc = nav.plugins['Shockwave Flash'].description;
  		if (desc && !((nav.mimeTypes != null && nav.mimeTypes['application/x-shockwave-flash']) && !nav.mimeTypes['application/x-shockwave-flash'].enabledPlugin)) {
  			version = parseInt(desc.match(/^.*\s+([^\s]+)\.[^\s]+\s+[^\s]+$/)[1], 10);
  		}
  	} else if (win.ActiveXObject != null) {
  		try {
  			testObject = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
  			if (testObject) {
  				version = parseInt(testObject.GetVariable('$version').match(/^[^\s]+\s(\d+)/)[1], 10);
  			}
  		} catch (e) { }
  	}
  
  	exports.flashVersion = version;
  	exports.hasFlash = function() { return exports.flashVersion > 0; };
  	return version > 0;
  };
  
  /**
   * Flash plugin version number
   */
  exports.flashVersion = 0;
  
  /**
   * Does platform support native full screen
   * @returns {Boolean}
   */
  exports.hasNativeFullscreen = function() {
  	var hasNativeFullscreen = typeof doc.createElement('video').webkitEnterFullScreen === 'function';
  	exports.hasNativeFullscreen = function() { return hasNativeFullscreen; };
  	return hasNativeFullscreen;
  };
  
  /**
   * Does platform support Canvas element
   * @returns {Boolean}
   */
  exports.hasCanvas = function() {
  	var elem = doc.createElement('canvas')
  		, hasCanvas = !!(elem.getContext && elem.getContext('2d'));
  	exports.hasCanvas = function() { return hasCanvas; };
  	return hasCanvas;
  };
  
  /**
   * Does platform support Touch events
   * @returns {Boolean}
   */
  exports.hasTouch = function() {
  	var hasTouch = 'ontouchstart' in win || (win.DocumentTouch && doc instanceof DocumentTouch);
  	exports.hasTouch = function() { return hasTouch; };
  	return hasTouch;
  };
  
});
require.register('env.platform', function(module, exports, require) {
  var ua = navigator.userAgent;
  
  /**
   * Is Internet Explorer
   */
  exports.isIE = (function() {
  	return !+"\v1";
  })();
  
  /**
   * Is iPad
   */
  exports.isIPad = (function() {
  	return /ipad/i.test(ua);
  })();
  
  /**
   * Is iPhone
   */
  exports.isIPhone = (function() {
  	return /iphone/i.test(ua);
  })();
  
  /**
   * Is iOS
   */
  exports.isIOS = (function() {
  	return exports.isIPhone || exports.isIPad || false;
  })();
  
  /**
   * Is iPhone MobileSafari
   */
  exports.isMobileSafari = (function() {
  	return exports.isIPhone && /safari/i.test(ua);
  })();
  
  /**
   * iOS version number
   */
  exports.iOSVersion = (function() {
  	var match;
  	match = navigator.userAgent.match(/os (\d+)_/i);
  	if (match != null ? match[1] : void 0) {
  		return match[1];
  	}
  })();
  
  /**
   * Is Android
   */
  exports.isAndroid = (function() {
  	return /android/i.test(ua);
  })();
  
  /**
   * Android version number
   */
  exports.androidVersion = (function() {
  	var match;
  	match = navigator.userAgent.match(/android (\d+)\./i);
  	if (match != null ? match[1] : void 0) {
  		return match[1];
  	}
  })();
  
  /**
   * Is mobile
   */
  exports.isMobile = (function() {
  	return /mobile/i.test(ua) && !exports.isIPad;
  })();
  
});
require.register('env.viewport', function(module, exports, require) {
  /**
   * Retrieve the viewport width
   * @returns {Number}
   */
  exports.getWidth = function() {
  	return document.documentElement.clientWidth;
  };
  
  /**
   * Retrieve the viewport height
   * @returns {Number}
   */
  exports.getHeight = function() {
  	return document.documentElement.clientHeight;
  };
  
});
require.register('util.colour', function(module, exports, require) {
  /**
   * Extract colour channels from a colour string (rgb(r,g,b), rrggbb, rgb)
   * @param {String} colour
   */
  exports.toComponent = function(colour) {
  	// Remove hash and spaces
  	colour = colour.replace(/[#\s]/g, '');
  
  	// rgb(r, g, b)
  	if (/^rgb/.test(colour)) {
  		var re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
  		var channels = re.exec(colour);
  		return {
  			r: parseInt(channels[1], 10),
  			g: parseInt(channels[2], 10),
  			b: parseInt(channels[3], 10)
  		};
  	// #rrggbb
  	} else if (colour.length === 6) {
  		re = /^(\w{2})(\w{2})(\w{2})$/;
  		channels = re.exec(colour);
  		return {
  			r: parseInt(channels[1], 16),
  			g: parseInt(channels[2], 16),
  			b: parseInt(channels[3], 16)
  		};
  	// #rgb
  	} else if (colour.length === 3) {
  		re = /^(\w{1})(\w{1})(\w{1})$/;
  		channels = re.exec(colour);
  		return {
  			r: parseInt(channels[1] + channels[1], 16),
  			g: parseInt(channels[2] + channels[2], 16),
  			b: parseInt(channels[3] + channels[3], 16)
  		};
  	}
  };
  
  /**
   * Generate rgba(r,g,b,a) colour string
   * @param {String} colour
   * @param {Number} alpha
   */
  exports.rgba = function(colour, alpha) {
  	var c;
  	c = exports.toComponent(colour);
  	return "rgba(" + c.r + "," + c.g + "," + c.b + "," + alpha + ")";
  };
  
});
require.register('util.log', function(module, exports, require) {
  /**
   * Sets debug environment and enables console.log when true
   */
  var initialized = false
  	, timestamp = true
  	, locations = '^http(|s):\/\/dev|^http(|s):\/\/localhost';
  
  /**
   * Configure log behaviour
   * Add whitelist locations, enable/disable timestamp
   * @param {Object} config
   */
  exports.init = function(config) {
  	if (config != null) {
  		timestamp = config.timestamp || timestamp;
  		locations = config.locations && new RegExp(locations + '|' + config.locations.join('|'), 'i');
  		window.debug = !!(document.location.href.match(locations)) || !!(document.location.hash.match(/debug/));
  		window.log = window.debug ? exports.log : (function() {});
  	}
  	return initialized = true;
  };
  
  /**
   * Log messages to the console
   * @param {*} arguments...
   */
  exports.log = function() {
  	var args = (1 <= arguments.length) ? Array.prototype.slice.call(arguments, 0) : [];
  	if (!initialized) {
  		exports.init();
  	}
  	if (window.debug) {
  		try {
  			var d = new Date();
  			var t = timestamp ? "" + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds()) + ":" + (d.getMilliseconds()) : '';
  			if (window.console) {
  				console.log(t, args);
  			}
  		} catch (error) { }
  	}
  };
  
});
require.register('browser.lib', function(module, exports, require) {
  exports.dom = {
  	classlist: require('dom.classlist'),
  	style: require('dom.style'),
  	element: require('dom.element'),
  	ready: require('dom.ready'),
  	select: require('dom.select'),
  	text: require('dom.text')
  };
  
  exports.environment = {
  	capabilities: require('env.capabilities'),
  	platform: require('env.platform'),
  	viewport: require('env.viewport')
  };
  
  exports.events = {
  	event: require('events.event')
  };
  
  exports.util = {
  	polyfill: require('util.polyfill'),
  	animate: require('util.animate'),
  	colour: require('util.colour'),
  	easing: require('util.easing'),
  	log: require('util.log'),
  	number: require('util.number'),
  	identify: require('util.identify')
  };
  
});