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
require.register('dom.style', function(module, exports, require) {
  // TODO: handle setting special shortcut transform properties with arrays (translate, scale)?
  
  var identify = require('util.identify')
  	,	isObject = identify.isObject
  	, isNan = identify.isNaN
  	, isArray = identify.isArray
  	, isString = identify.isString
  	, map = [].map
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
require.register('events.event', function(module, exports, require) {
  var platform = require('env.platform')
  	, capabilities = require('env.capabilities')
  	, win = window
  	, doc = win.document
  	, element = null
  	, domListeners = []
  	, id = 0;
  
  /**
   * Register for event notification
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   * @param {Object} data
   */
  exports.on = function(target, type, callback, data) {
  	// DOM event
  	if (isValidElement(target)) {
  		// Create custom handler
  		var handler = createHandler(target, type, data, callback);
  		handler.id = id++;
  		// Cache event listener object
  		domListeners.push({
  			target: target,
  			type: type,
  			handler: handler,
  			callback: callback
  		});
  		if (target.domElement) target = target.domElement;
  		type = getType(type);
  		if (target.addEventListener) {
  			target.addEventListener(type, handler, false);
  		} else if (target.attachEvent) {
  			target.attachEvent("on" + type, handler);
  		}
  	// Custom event
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
   * @param {Object} data
   */
  exports.one = function(target, type, callback, data) {
  	var cb;
  	// Wrap callback
  	exports.on(target, type, cb = function(event) {
  		callback.call(null, event);
  		return exports.off(target, type, cb);
  	}, data);
  	// Chain
  	return target;
  };
  
  /**
   * Unregister for event notification
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   */
  exports.off = function(target, type, callback) {
  	// DOM event
  	if (isValidElement(target)) {
  		var listener;
  		if (listener = removeCachedListener(target, type, callback)) {
  			if (target.domElement) target = target.domElement;
  			type = getType(type);
  			if (target.removeEventListener) {
  				target.removeEventListener(type, listener.handler, false);
  			} else if (target.detachEvent) {
  				target.detachEvent("on" + type, listener.handler);
  			}
  		}
  	// Custom event
  	} else {
  		var handlers = target._handlers[type];
  		for (var i = 0, n = handlers.length; i < n; i++) {
  			if (callback === handlers[i]) {
  				target.handlers.splice(i, 1);
  				break;
  			}
  		}
  	}
  	// Chain
  	return target;
  };
  
  /**
   * Unregister all events
   * @param {Object} target
   */
  exports.offAll = function(target) {
  	// DOM event
  	if (isValidElement(target)) {
  		var listener;
  		for (var i = 0, n = domListeners.length; i < n; i++) {
  			listener = domListeners[i];
  			if (target === (listener.target.domElement || listener.target)) {
  				exports.off(listener.target, listener.type, listener.callback);
  			}
  		}
  	// Custom event
  	} else {
  		target._handlers = null;
  	}
  	// Chain
  	return target;
  };
  
  /**
   * Dispatch an event to registered listeners
   * @param {Object} target
   * @param {String} type
   * @param {Object} data
   */
  exports.trigger = function(target, type, data) {
  	var callback, evt, list;
  	// Custom event
  	if (!isValidElement(target)) {
  		if (target._handlers && type in target._handlers) {
  			// copy the callback hash to avoid mutation errors
  			list = target._handlers[type].slice();
  			evt = new Event(target, type, data);
  			// skip loop if only a single listener
  			if (list.length == 1) {
  				list[0].call(target, evt);
  			} else {
  				for (var i = 0, n = list.length; i < n; i++) {
  					list[i].call(target, evt);
  				}
  			}
  			// Chain
  			return target;
  		}
  	}
  };
  
  /**
   * Decorate 'target' with dispatcher behaviour
   * @param {Object} target
   */
  exports.dispatcher = function(target) {
  	// Custom event
  	if (!isValidElement(target)) {
  		target['on'] = function(type, callback) { return exports.on(this, type, callback); };
  		target['off'] = function(type, callback) { return exports.off(this, type, callback); };
  		target['one'] = function(type, callback) { return exports.one(this, type, callback); };
  		target['trigger'] = function(type, data) { return exports.trigger(this, type, data); };
  	}
  };
  
  /**
   * Determine if 'element' is a valid DOM element
   * @param {Object} element
   * @returns {Boolean}
   */
  function isValidElement (element) {
  	return !!(element
  		&& ((element.domElement != null)
  		|| element === win
  		|| element.nodeType === 9
  		|| element.nodeType === 1));
  };
  
  /**
   * Create handler function
   * @param {Object} target
   * @param {String} type
   * @param {Object} data
   * @param {Function} callback
   * @returns {Function}
   */
  function createHandler(target, type, data, callback) {
  	return function(event) {
  		return callback(new DomEvent(event, target, type, data));
  	};
  };
  
  /**
   * Remove listener object from cache
   * @param {Object} target
   * @param {String} type
   * @param {Function} callback
   */
  function removeCachedListener(target, type, callback) {
  	var item;
  	for (var i = 0, n = domListeners.length; i < n; i++) {
  		item = domListeners[i];
  		if ((item.target.domElement === target.domElement || item.target === target)
  			&& item.type === type
  			&& item.callback === callback) {
  				return domListeners.splice(i, 1)[0];
  		}
  	}
  };
  
  /**
   * Convert mouse events to touch equivalents
   * @param {String} type
   * @returns {String}
   */
  function getType(type) {
  	if (capabilities.hasTouch()) {
  		switch (type) {
  			case 'mousedown':
  				type = 'touchstart';
  				break;
  			case 'mousemove':
  				type = 'touchmove';
  				break;
  			case 'mouseup':
  				type = 'touchend';
  				break;
  		}
  	}
  	return type;
  };
  
  /**
   * Event class
   * @param {Object} target
   * @param {String} type
   * @param {Object} data
   */
  function Event(target, type, data) {
  	this.target = target;
  	this.type = type;
  	this.data = data;
  }
  
  /**
   * DomEvent class
   * @param {Object} event
   * @param {Object} target
   * @param {String} type
   * @param {Object} data
   */
  function DomEvent(event, target, type, data) {
  	this.type = type;
  	this.data = data;
  	this.domEvent = event || win.event;
  	this.currentTarget = target;
  	this.target = this.domEvent.target || this.domEvent.srcElement || win;
  	// Text node parent
  	if (this.target.nodeType === 3) this.target = this.target.parentNode;
  	// Convert to Element if necessary
  	if (!this.target.domElement && this.target.nodeType === 1) {
  		// Late retrieval to prevent circular dependency returning empty object
  		if (element == null) element = require('dom.element');
  		this.target = element(this.target);
  	}
  
  	// Right click
  	if (this.domEvent.which) {
  		this.rightClick = this.domEvent.which === 3;
  	} else if (this.domEvent.button) {
  		this.rightClick = this.domEvent.button === 2;
  	} else {
  		this.rightClick = false;
  	}
  	// Left click
  	if (this.domEvent.which) {
  		this.leftClick = this.domEvent.which === 1;
  	} else if (this.domEvent.button) {
  		this.leftClick = (this.domEvent.button === 0 || this.domEvent.button === 2);
  	} else {
  		this.leftClick = true;
  	}
  
  	if (this.type === 'mousedown' || this.type === 'mousemove') {
  		// Global coordinates
  		if (this.domEvent.touches) {
  			this.touches = this.domEvent.touches;
  			if (this.touches.length) {
  				this.pageX = this.touches[0].pageX;
  				this.pageY = this.touches[0].pageY;
  			}
  		} else {
  			this.pageX = this.domEvent.pageX != null ? this.domEvent.pageX : this.domEvent.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;
  			this.pageY = this.domEvent.pageY != null ? this.domEvent.pageY : this.domEvent.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
  		}
  		// Local coordinates
  		if ((this.domEvent.offsetX != null)
  			&& (this.domEvent.offsetY != null)
  			&& (this.domEvent.offsetX !== 0
  			&& this.domEvent.offsetY !== 0)) {
  				this.x = this.domEvent.offsetX;
  				this.y = this.domEvent.offsetY;
  		} else if ((this.domEvent.x != null)
  			&& (this.domEvent.y != null)) {
  				this.x = this.domEvent.x;
  				this.y = this.domEvent.y;
  		} else {
  			var pos = this.target.domElement ? this.target.position() : {left: this.target.offsetLeft, top: this.target.offsetTop};
  			this.x = this.pageX ? this.pageX - pos.left : 0;
  			this.y = this.pageY ? this.pageY - pos.top : 0;
  		}
  	}
  }
  
  /**
   * Prevent event default
   */
  DomEvent.prototype.preventDefault = function() {
  	if (this.domEvent.preventDefault) {
  		return this.domEvent.preventDefault();
  	} else {
  		return this.domEvent.returnValue = false;
  	}
  };
  
  /**
   * Stop event propagation
   */
  DomEvent.prototype.stopPropagation = function() {
  	if (this.domEvent.stopPropagation) {
  		return this.domEvent.stopPropagation();
  	} else {
  		return this.domEvent.cancelBubble = true;
  	}
  };
  
  /**
   * Prevent event default and stop event propagation
   */
  DomEvent.prototype.stop = function() {
  	this.preventDefault();
  	this.stopPropagation();
  };
  
  /*
  // Enable :active styles on touch devices
  if (capabilities.hasTouch()) {
  	exports.on(doc, 'touchstart', function(){});
  }
  */
  
  // Clear handlers on window unload to prevent memory leaks (IE)
  if ((win != null) && win.attachEvent && !win.addEventListener) {
  	win.attachEvent('onunload', function() {
  		var listener;
  		for (var i = 0, n = domListeners.length; i < n; i++) {
  			listener = domListeners[i];
  			try {
  				exports.off(listener.target, listener.type, listener.callback);
  			} catch (e) { }
  		}
  	});
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
require.register('util.easing/lib/cubic', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inCubic = {
  	js: function(t, b, c, d) {
  			return c * (t /= d) * t * t + b;
  		},
  	css: 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
  };
  
  exports.outCubic = {
  	js: function(t, b, c, d) {
  			return c * ((t = t / d - 1) * t * t + 1) + b;
  		},
  	css: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
  };
  
  exports.inOutCubic = {
  	js: function(t, b, c, d) {
  			if ((t /= d / 2) < 1) {
  				return c / 2 * t * t * t + b;
  			}
  			return c / 2 * ((t -= 2) * t * t + 2) + b;
  		}
  };
  
});
require.register('util.animate', function(module, exports, require) {
  var style = require('dom.style')
  	,	identify = require('util.identify')
  	, isFunction = identify.isFunction
  	, isString = identify.isString
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
  	, DEFAULT_EASING = require('util.easing/lib/cubic').outCubic
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
require.register('util.easing/lib/linear', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.linear = {
  	js: function(t, b, c, d) {
  			return c * t / d + b;
  		},
  	css: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
  }
});
require.register('util.easing/lib/back', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inBack = {
  	js: function(t, b, c, d) {
  			if (s != null) {
  				s = 1.70158;
  			}
  			return c * (t /= d) * t * ((s + 1) * t - s) + b;
  		},
  	css: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
  };
  
  exports.outBack = {
  	js: function(t, b, c, d) {
  			if (s != null) {
  				s = 1.70158;
  			}
  			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  		},
  	css: 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
  };
  
  exports.inOutBack = {
  	js: function(t, b, c, d) {
  			if (s != null) {
  				s = 1.70158;
  			}
  			if ((t /= d / 2) < 1) {
  				return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  			}
  			return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  		},
  	css: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)'
  };
  
});
require.register('util.easing/lib/bounce', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inBounce = {
  	js: function(t, b, c, d) {
  			return c - exports.outBounce(x, d - t, 0, c, d) + b;
  		}
  };
  
  exports.outBounce = {
  	js: function(t, b, c, d) {
  			if ((t /= d) < (1 / 2.75)) {
  				return c * (7.5625 * t * t) + b;
  			} else if (t < (2 / 2.75)) {
  				return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  			} else if (t < (2.5 / 2.75)) {
  				return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  			} else {
  				return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  			}
  		}
  };
  
  exports.inOutBounce = {
  	js: function(t, b, c, d) {
  			if (t < d / 2) {
  				return exports.inBounce(x, t * 2, 0, c, d) * 0.5 + b;
  			}
  			return exports.outBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  		}
  };
  
});
require.register('util.easing/lib/circ', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inCirc = {
  	js: function(t, b, c, d) {
  			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  		},
  	css: 'cubic-bezier(0.600, 0.040, 0.980, 0.335)'
  };
  
  exports.outCirc = {
  	js: function(t, b, c, d) {
  			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  		},
  	css: 'cubic-bezier(0.075, 0.820, 0.165, 1.000)'
  };
  
  exports.inOutCirc = {
  	js: function(t, b, c, d) {
  			if ((t /= d / 2) < 1) {
  				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
  			}
  			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  		},
  	css: 'cubic-bezier(0.785, 0.135, 0.150, 0.860)'
  };
  
});
require.register('util.easing/lib/elastic', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inElastic = {
  	js: function(t, b, c, d) {
  			var a, p, s;
  			if (t === 0) {
  				return b;
  			}
  			if ((t /= d) === 1) {
  				return b + c;
  			}
  			if (!p) {
  				p = d * 0.3;
  			}
  			if (!a || a < Math.abs(c)) {
  				a = c;
  				s = p / 4;
  			} else {
  				s = p / (2 * Math.PI) * Math.asin(c / a);
  			}
  			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  		}
  };
  
  exports.outElastic = {
  	js: function(t, b, c, d) {
  			var a, p, s;
  			if (t === 0) {
  				return b;
  			}
  			if ((t /= d) === 1) {
  				return b + c;
  			}
  			if (!p) {
  				p = d * 0.3;
  			}
  			if (!a || a < Math.abs(c)) {
  				a = c;
  				s = p / 4;
  			} else {
  				s = p / (2 * Math.PI) * Math.asin(c / a);
  			}
  			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  		}
  };
  
  exports.inOutElastic = {
  	js: function(t, b, c, d) {
  			var a, p, s;
  			if (t === 0) {
  				return b;
  			}
  			if ((t /= d / 2) === 2) {
  				return b + c;
  			}
  			if (!p) {
  				p = d * (0.3 * 1.5);
  			}
  			if (!a || a < Math.abs(c)) {
  				a = c;
  				s = p / 4;
  			} else {
  				s = p / (2 * Math.PI) * Math.asin(c / a);
  			}
  			if (t < 1) {
  				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  			}
  			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  		}
  };
  
});
require.register('util.easing/lib/expo', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inExpo = {
  	js: function(t, b, c, d) {
  			if (t === 0) {
  				return b;
  			} else {
  				return c * Math.pow(2, 10 * (t / d - 1)) + b;
  			}
  		},
  	css: 'cubic-bezier(0.950, 0.050, 0.795, 0.035)'
  };
  
  exports.outExpo = {
  	js: function(t, b, c, d) {
  			if (t === d) {
  				return b + c;
  			} else {
  				return c * (-Math.pow(2, -10 * t / d) + 1) + b;
  			}
  		},
  	css: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
  };
  
  exports.inOutExpo = {
  	js: function(t, b, c, d) {
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
  		},
  	css: 'cubic-bezier(1.000, 0.000, 0.000, 1.000)'
  };
  
});
require.register('util.easing/lib/quad', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inQuad = {
  	js: function(t, b, c, d) {
  			return c * (t /= d) * t + b;
  		},
  	css: 'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
  };
  
  exports.outQuad = {
  	js: function(t, b, c, d) {
  			return -c * (t /= d) * (t - 2) + b;
  		},
  	css: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)'
  };
  
  exports.inOutQuad = {
  	js: function(t, b, c, d) {
  			if ((t /= d / 2) < 1) {
  				return c / 2 * t * t + b;
  			}
  			return -c / 2 * ((--t) * (t - 2) - 1) + b;
  		}
  };
  
});
require.register('util.easing/lib/quart', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inQuart = {
  	js: function(t, b, c, d) {
  			return c * (t /= d) * t * t * t + b;
  		},
  	css: 'cubic-bezier(0.895, 0.030, 0.685, 0.220)'
  };
  
  exports.outQuart = {
  	js: function(t, b, c, d) {
  			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  		},
  	css: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
  };
  
  exports.inOutQuart = {
  	js: function(t, b, c, d) {
  			if ((t /= d / 2) < 1) {
  				return c / 2 * t * t * t * t + b;
  			}
  			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  		},
  	css: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)'
  };
  
});
require.register('util.easing/lib/quint', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inQuint = {
  	js: function(t, b, c, d) {
  			return c * (t /= d) * t * t * t * t + b;
  		},
  	css: 'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
  };
  
  exports.outQuint = {
  	js: function(t, b, c, d) {
  			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  		},
  	css: 'cubic-bezier(0.230, 1.000, 0.320, 1.000)'
  };
  
  exports.inOutQuint = {
  	js: function(t, b, c, d) {
  			if ((t /= d / 2) < 1) {
  				return c / 2 * t * t * t * t * t + b;
  			}
  			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  		},
  	css: 'cubic-bezier(0.860, 0.000, 0.070, 1.000)'
  };
  
});
require.register('util.easing/lib/sine', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inQuint = {
  	js: function(t, b, c, d) {
  			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  		},
  	css: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
  };
  
  exports.outQuint = {
  	js: function(t, b, c, d) {
  			return c * Math.sin(t / d * (Math.PI / 2)) + b;
  		},
  	css: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
  };
  
  exports.inOutQuint = {
  	js: function(t, b, c, d) {
  			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  		},
  	css: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
  };
  
});
require.register('util.easing', function(module, exports, require) {
  // Based on the infamous Penner easing equations, with css equivalents where possible
  exports.linear = require('util.easing/lib/linear');
  exports.back = require('util.easing/lib/back');
  exports.bounce = require('util.easing/lib/bounce');
  exports.circ = require('util.easing/lib/circ');
  exports.cubic = require('util.easing/lib/cubic');
  exports.elastic = require('util.easing/lib/elastic');
  exports.expo = require('util.easing/lib/expo');
  exports.quad = require('util.easing/lib/quad');
  exports.quart = require('util.easing/lib/quart');
  exports.quint = require('util.easing/lib/quint');
  exports.sine = require('util.easing/lib/sine');
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