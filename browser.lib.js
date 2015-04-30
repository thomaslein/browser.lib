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
  // TODO: bulk transform properties
  
  var identify = require('util.identify')
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
  			'skewX': 'deg',
  			'skewY': 'deg'
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
  			'skew': true,
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
  exports.getDocumentStyle = getDocumentStyle;
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
  
  	if (value == null || value == 'none') {
  		value = 0;
  	}
  
  	// Handle arrays of values (translate, scale)
  	if (identify.isArray(value)) {
  		return value.map(function (val) {
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
  		if (identify.isNaN(num)) {
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
  				if (identify.isArray(value)) {
  					// Add default unit
  					value = value.map(function(item) {
  						return !identify.isString(item) ? item + 'px': item;
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
  				if (identify.isArray(value)) {
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
   * Retrieve the 'property' for matching 'selector' rule in all document stylesheets
   * @param {String} selector
   * @param {String} property
   * @returns {String}
   */
  function getDocumentStyle (selector, property) {
  	var styleSheets = document.styleSheets
  		, sheet, rules, rule;
  
  	if (styleSheets) {
  		for (var i = 0, n = styleSheets.length; i < n; i++) {
  			sheet = styleSheets[i];
  			if (rules = sheet.rules || sheet.cssRules) {
  				for (var j = 0, m = rules.length; j < m; j++) {
  					rule = rules[j];
  					if (selector === rule.selectorText) {
  						return rule.style.getPropertyValue(property);
  					}
  				}
  			}
  		}
  	}
  
  	return '';
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
  	if (identify.isObject(prop)) {
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
  	if (identify.isArray(matrix)) {
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
  
  	if (elements.length === 1) {
  		return elements[0]
  	}else if (elements.length > 1) {
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
  var HTML_EVENTS = 'click dblclick mouseup mousedown contextmenu mousewheel mousemultiwheel DOMMouseScroll mouseover mouseout mousemove selectstart selectend keydown keypress keyup orientationchange focus blur change reset select submit load unload beforeunload resize move DOMContentLoaded readystatechange message error abort scroll show input invalid touchstart touchmove touchend touchcancel gesturestart gesturechange gestureend textinput readystatechange pageshow pagehide popstate hashchange offline online afterprint beforeprint dragstart dragenter dragover dragleave drag drop dragend loadstart progress suspend emptied stalled loadmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange volumechange cuechange checking noupdate downloading cached updateready obsolete'
  	, EVENT_PROPS = 'altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement timeStamp view which propertyName button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ char charCode key keyCode keyIdentifier keyLocation location touches targetTouches changedTouches scale rotation data origin source state'
  
  	, domHandlers = {}
  	, uid = 1
  	, htmlEvents = {}
  	, eventProps = {};
  
  // Convert to hash
  for (var i = 0, events = HTML_EVENTS.split(' '), n = events.length; i < n; i++) {
  	htmlEvents[events[i]] = true;
  }
  for (i = 0, events = EVENT_PROPS.split(' '), n = events.length; i < n; i++) {
  	eventProps[events[i]] = true;
  }
  
  /**
   * Register for event notification
   * @param {Object} [target]
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.on = function (target, type, callback) {
  	if (typeof target == 'string') {
  		callback = type;
  		type = target;
  		// Assign 'target' to this
  		// if not mixed into an object the target becomes this module
  		target = this;
  	}
  
  	if (!target || !callback) return target;
  
  	if (isElement(target)) {
  		var id = target.getAttribute('data-event-id')
  			, cb = createDOMHandler(callback);
  
  		// Store id on target and create hash
  		if (!id) {
  			id = uid++;
  			target.setAttribute('data-event-id', id);
  			domHandlers[id] = {};
  		}
  		// Create cache by event type
  		if (!(type in domHandlers[id])) domHandlers[id][type] = [];
  		// Skip if already registered
  		if (!findInStore(domHandlers[id][type], callback)) {
  			domHandlers[id][type].push({
  				callback: callback,
  				cb: cb
  			});
  			target.addEventListener(type, cb, false);
  		}
  
  	} else {
  		// Store and register
  		if (target._handlers == null) target._handlers = {};
  		if (!(type in target._handlers)) target._handlers[type] = [];
  		// Skip if already registered
  		if (!findInStore(target._handlers[type], callback)) {
  			target._handlers[type].push({callback: callback});
  		}
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Register for one time event notification
   * @param {Object} [target]
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.once = function (target, type, callback) {
  	if (typeof target == 'string') {
  		callback = type;
  		type = target;
  		// Assign 'target' to this
  		// if not mixed into an object the target becomes this module
  		target = this;
  	}
  
  	if (!target || !callback) return target;
  
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
   * @param {Object} [target]
   * @param {String} type
   * @param {Function} callback
   * @returns {Object}
   */
  exports.off = function (target, type, callback) {
  	// TODO: remove all handlers by type if no callback?
  	if (typeof target == 'string') {
  		callback = type;
  		type = target;
  		// Assign 'target' to this
  		// if not mixed into an object the target becomes this module
  		target = this;
  	}
  
  	if (!target || !callback) return target;
  
  	if (isElement(target)) {
  		var id = target.getAttribute('data-event-id')
  			, item;
  
  		// Retrieve from cache
  		if (id && domHandlers[id] && domHandlers[id][type]) {
  			// Remove
  			if (item = findInStore(domHandlers[id][type], callback, true)) {
  				target.removeEventListener(type, item.cb, false);
  			}
  		}
  
  	} else {
  		if (target._handlers && target._handlers[type]) {
  			// Remove
  			findInStore(target._handlers[type], callback, true);
  		}
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Unregister all events
   * @param {Object} [target]
   * @returns {Object}
   */
  exports.offAll = function (target) {
  	if (!target) {
  		// Assign 'target' to this
  		// if not mixed into an object the target becomes this module
  		target = this;
  	}
  
  	if (isElement(target)) {
  		var id = target.getAttribute('data-event-id');
  
  		if (id && domHandlers[id]) {
  			// Unregister all events
  			for (var type in domHandlers[id]) {
  				for (var i = 0, n = domHandlers[id][type].length; i < n; i++) {
  					target.removeEventListener(type, domHandlers[id][type][i].cb, false);
  				}
  			}
  			// Clear cache
  			domHandlers[id] = {};
  		}
  	} else {
  		// Clear cache
  		target._handlers = {};
  	}
  
  	// Chain
  	return target;
  };
  
  /**
   * Dispatch an event to registered listeners
   * @param {Object} [target]
   * @param {String|Object} type
   * @param {Object} [data]
   * @returns {Object}
   */
  exports.trigger = function (target, type, data) {
  	if (typeof target == 'string') {
  		data = type;
  		type = target;
  		// Assign 'target' to this
  		// if not mixed into an object the target becomes this module
  		target = this;
  	}
  
  	if (!target) return null;
  
  	var evt, list;
  
  	if (isElement(target)) {
  		// Create DOM event based on type
  		var isHtmlEvent = type in htmlEvents;
  		evt = document.createEvent(isHtmlEvent ? 'HTMLEvents' : 'UIEvents');
  		evt[isHtmlEvent ? 'initEvent' : 'initUIEvent'](type, true, true, window, 1);
  		evt.data = data;
  		return target.dispatchEvent(evt);
  	} else {
  		// Re-trigger: handle passed in event object
  		if ('object' == typeof type) {
  				evt = type;
  				evt.relatedTarget = evt.target;
  				evt.target = target;
  				type = evt.type;
  		}
  
  		if (target._handlers && type in target._handlers) {
  			evt = evt || new Event({target:target, type:type, data:data});
  			// copy the callback hash to avoid mutation errors
  			list = target._handlers[type].slice();
  			// skip loop if only a single listener
  			if (list.length == 1) {
  				list[0].callback.call(target, evt);
  			} else {
  				for (var i = 0, n = list.length; i < n; i++) {
  					// Exit if event has been stopped
  					if (evt.isStopped) break;
  					list[i].callback.call(target, evt);
  				}
  			}
  			return true;
  		}
  	}
  	return false;
  };
  
  exports._handlers = null;
  
  /**
   * Find 'callback' in 'store' and optionally 'remove'
   * @param {Array} store
   * @param {Function} callback
   * @param {Boolean} [remove]
   * @returns {Object}
   */
  function findInStore (store, callback, remove) {
  	var item;
  
  	for (var i = 0, n = store.length; i < n; i++) {
  		item = store[i];
  		if (item.callback === callback) {
  			if (remove) store.splice(i, 1);
  			return item;
  		}
  	}
  
  	return null;
  }
  
  /**
   * Wrap 'callback' handler
   * @param {Function} callback
   * @returns {Function}
   */
  function createDOMHandler (callback) {
  	return function (evt) {
  		callback(new Event(evt));
  	}
  }
  
  /**
   * Determine if 'element' is a DOMElement
   * @param {Object} element
   * @returns {Boolean}
   */
  function isElement (element) {
  	return !!(element
  		&& (element === window
  		|| element.nodeType === 9
  		|| element.nodeType === 1));
  }
  
  /**
   * Constructor
   * @param {Object} event
   */
  function Event (event) {
  	var target = event.target || event.srcElement;
  
  	this.isStopped = false;
  	this.originalEvent = event;
  	this.type = event.type;
  	this.target = target;
  
  	// Fix targets
  	if (target) {
  		// Avoid text nodes
  		if (target.nodeType === 3) this.target = target.parentNode;
  		// SVG element
  		if (target.correspondingUseElement || target.correspondingElement) this.target = target.correspondingUseElement || target.correspondingElement;
  	}
  
  	// Copy properties
  	for (var prop in eventProps) {
  		if (eventProps.hasOwnProperty(prop)) this[prop] = event[prop];
  	}
  
  	// Fix properties
  	this.keyCode = event.keyCode || event.which;
  	this.rightClick = event.which === 3 || event.button === 2;
  	if (event.pageX || event.pageY) {
  		this.clientX = event.pageX;
  		this.clientY = event.pageY;
  	} else if (event.clientX || event.clientY) {
  		this.clientX = event.clientX + document.body.scrollLeft + doc.documentElement.scrollLeft;
  		this.clientY = event.clientY + document.body.scrollTop + doc.documentElement.scrollTop;
  	}
  }
  
  Event.prototype.preventDefault = function () {
  	if (this.originalEvent.preventDefault) this.originalEvent.preventDefault();
  };
  
  Event.prototype.stopPropagation = function () {
  	if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation();
  };
  
  Event.prototype.stopImmediatePropagation = function () {
  	if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation();
  	this.isStopped = true;
  };
  
  Event.prototype.stop = function () {
  	this.preventDefault();
  	this.stopImmediatePropagation();
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
  var normalize = exports.normalize = function(value, min, max){
  	if(min === max || value >= max){
  		return 1
  	}else if (value <= min){
  		return 0
  	}else{
  		return (value-min) / (max-min)
  	}	
  }
  
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
  	var parts = value.toString().split('.')
  		, pre = parts[0] + parts[1].substr(0, decimalPlaces)
  		, post = parts[1].slice(decimalPlaces)
  		, postRound = Math.round(post/Math.pow(10, (post.length)))
  		, places = Math.pow(10, (decimalPlaces || 0));
  
  	return (parts[1].length <= decimalPlaces) ? value : (+pre + postRound) / places;
  };
  
});
require.register('requestAnimationFrame', function(module, exports, require) {
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
require.register('util.ease/lib/cubic', function(module, exports, require) {
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
  require('requestAnimationFrame')
  var style = require('dom.style')
  	, identify = require('util.identify')
  	, isFunction = identify.isFunction
  	, isString = identify.isString
  	, isArray = identify.isArray
  	, isObject = identify.isObject
  	, colourUtil = require('util.colour')
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
  	, DEFAULT_EASING = require('util.ease/lib/cubic').outCubic
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
  		, s, e, callback, callbacks, dur, propObj, value;
  
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
  				s = propObj.start;
  				//Handle arrays for transforms like translate and scale
  				if (isArray(propObj.end)){
  					var values = [];
  					for (var i = 0; i < propObj.end.length; i++) {
  						e = propObj.end[i] - s;
  						value = propObj.current = anim.ease.js(dur, s, e, anim.duration);
  						values.push(value);
  					}
  				//Handle objects for rgb colours
  				}else if(isObject(propObj.end)){
  					var r,g,b;
  					for (var key in propObj.end){
  						if (propObj.end.hasOwnProperty(key)) {
           			s = propObj.start[key];
           			e = Math.abs(propObj.end[key] - s);
           			if (key === 'r'){
           				r = propObj.current = anim.ease.js(dur, s, e, anim.duration);
           			}else if( key === 'g'){
           				g = propObj.current = anim.ease.js(dur, s, e, anim.duration);
           			}else if (key == 'b'){
           				b = propObj.current = anim.ease.js(dur, s, e, anim.duration);
           			}
      				}
  					}
  				}else{
  					e = propObj.end - s;
  					value = propObj.current = anim.ease.js(dur, s, e, anim.duration);
  				}
  				switch (propObj.type) {
  					case 1:
  						anim.target[prop](value);
  						break;
  					case 2:
  						anim.target[prop] = value;
  						break;
  					case 3:
  						//Handle arrays for transforms like translate and scale
  						if (isArray(propObj.end)){
  							style.setStyle(anim.target, prop, values);
  						//Handle rgb colors
  						}else if(isObject(propObj.end)){
  							style.setStyle(anim.target, prop, 'rgb('+Math.ceil(r)+','+Math.ceil(g)+','+Math.ceil(b)+')');
  						}else{
  							style.setStyle(anim.target, prop, "" + value + propObj.unit);
  						}
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
  
  		//Property is a property
  		} else if (prop in this.target && !isArray(p.end)) {
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
  				if (!style.hasTransitions){
  					// Need to handle colours diffrently with no transitions
  					// TODO: Handle rgba colours
  					if (end[1] === 'hex' || end[1] ===  'rgb'){
  						//Convert colours to component and hex to rgb
  						p.start = colourUtil.toComponent(current[0]);
  						p.end = colourUtil.toComponent(end[0]);
  					}
  				}
  
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
  				style.setStyle(this.target, prop, p.end);
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
  Element.prototype.getHeight = function() {
  	return this.domElement.offsetHeight;
  };
  
  /**
   * Set height
   * @param {Number} value
   */
  Element.prototype.setHeight = function(value) {
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
  	event.on(this.domElement, type, callback, data);
  	return this;
  };
  
  /**
   * @see event.off
   */
  Element.prototype.off = function(type, callback) {
  	event.off(this.domElement, type, callback);
  	return this;
  };
  
  /**
   * @see event.one
   */
  Element.prototype.one = function(type, callback, data) {
  	event.one(this.domElement, type, callback, data);
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
   * @param {String} or {Object} type
   * @param {String} value
   */
  Element.prototype.setAttribute = function(type, value) {
  	if(identify.isObject(type)){
  		for(var key in type) {
      	this.domElement.setAttribute(key, type[key]);
    	}
  	}else if(identify.isString(type)){
  		this.domElement.setAttribute(type, value);
  	}
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
   * Insert HTML before the element itself
   * @param {String} value
   */
  Element.prototype.before = function(value) {
  	return this.domElement.insertAdjacentHTML('beforebegin', value);
  };
  
  /**
   * Insert HTML after the element itself
   * @param {String} value
   */
  Element.prototype.after = function(value) {
  	return this.domElement.insertAdjacentHTML('afterend', value);
  };
  
  /**
   * Insert HTML just inside the element, before its first child
   * @param {String} value
   */
  Element.prototype.prepend = function(value) {
  	return this.domElement.insertAdjacentHTML('afterbegin', value);
  };
  
  /**
   * Insert HTML just inside the element, after its last child
   * @param {String} value
   */
  Element.prototype.append = function(value) {
  	return this.domElement.insertAdjacentHTML('beforeend', value);
  };
  
  /**
   * Wrap 'element'
   * @param {DOMElement or Element} element
   */
  Element.prototype.wrap = function(element) {
    if (!element.length) element = [element];
    for (var i = element.length - 1; i >= 0; i--) {
      var child = (i > 0) ? this.domElement.cloneNode(true) : this.domElement;
      var el = element[i];
      var parent  = (el.domElement) ? el.domElement.parentNode : el.parentNode
      var sibling = (el.domElement) ? el.domElement.nextSibling : el.nextSibling
  
      child.appendChild(el.domElement || el);
  
      if(sibling) {
      	parent.insertBefore(child, sibling);
      }else{
      	parent.appendChild(child);
      }
    }
  };
  
  /**
   * Wrap all 'elements'
   * @param {DOMElement or Element} element
   */
  Element.prototype.wrapAll = function(element) {
    var el = element.length ? element[0] : element;
    var parent  = (el.domElement) ? el.domElement.parentNode : el.parentNode
    var sibling = (el.domElement) ? el.domElement.nextSibling : el.nextSibling
    this.appendChild(el.domElement || el);
  
    while (element.length) {
    	this.domElement.appendChild(elms[0]);
    }
  
    if(sibling) {
    	parent.insertBefore(this.domElement, sibling);
    }else{
    	parent.appendChild(this.domElement);
    }
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
  
  /**
   * Does platform support inline svg
   * @returns {Boolean}
   */
  exports.hasSVG = function(){
  	var test = document.createElement('div');
  	test.innerHTML = '<svg/>';
  	var hasSVG = (test.firstChild && test.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
  	exports.hasSVG = function(){ return hasSVG; };
  	return hasSVG;
  }
  
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
require.register('util.ease/lib/linear', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.linear = {
  	js: function(t, b, c, d) {
  			return c * t / d + b;
  		},
  	css: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)'
  }
});
require.register('util.ease/lib/back', function(module, exports, require) {
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
require.register('util.ease/lib/bounce', function(module, exports, require) {
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
require.register('util.ease/lib/circ', function(module, exports, require) {
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
require.register('util.ease/lib/elastic', function(module, exports, require) {
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
require.register('util.ease/lib/expo', function(module, exports, require) {
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
require.register('util.ease/lib/quad', function(module, exports, require) {
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
require.register('util.ease/lib/quart', function(module, exports, require) {
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
require.register('util.ease/lib/quint', function(module, exports, require) {
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
require.register('util.ease/lib/sine', function(module, exports, require) {
  // t: current time, b: beginning value, c: change in value, d: duration
  
  exports.inSine = {
  	js: function(t, b, c, d) {
  			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  		},
  	css: 'cubic-bezier(0.470, 0.000, 0.745, 0.715)'
  };
  
  exports.outSine = {
  	js: function(t, b, c, d) {
  			return c * Math.sin(t / d * (Math.PI / 2)) + b;
  		},
  	css: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)'
  };
  
  exports.inOutSine = {
  	js: function(t, b, c, d) {
  			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  		},
  	css: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
  };
  
});
require.register('util.ease', function(module, exports, require) {
  // Based on the infamous Penner easing equations, with css equivalents where possible
  exports.linear = require('util.ease/lib/linear');
  exports.back = require('util.ease/lib/back');
  exports.bounce = require('util.ease/lib/bounce');
  exports.circ = require('util.ease/lib/circ');
  exports.cubic = require('util.ease/lib/cubic');
  exports.elastic = require('util.ease/lib/elastic');
  exports.expo = require('util.ease/lib/expo');
  exports.quad = require('util.ease/lib/quad');
  exports.quart = require('util.ease/lib/quart');
  exports.quint = require('util.ease/lib/quint');
  exports.sine = require('util.ease/lib/sine');
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
require.register('util.object', function(module, exports, require) {
  /**
   * Allow 'Child' Constructor to inherit from 'Parent', including 'own' properties
   * --from CoffeeScript boilerplate--
   * @param {Function} Child
   * @param {Function} Parent
   * @returns {Function}
   */
  exports.inherit = function (Child, Parent) {
  	// Copy 'own' properties from Parent to Child
  	for (var key in Parent) {
  		if (Parent.hasOwnProperty(key)) {
  			Child[key] = Parent[key];
  		}
  	}
  	// Proxy constructor function
  	function Ctor() {
  		// Set constructor property to point to Child
  		this.constructor = Child;
  		// Store reference to Child's 'super'
  		this.super = Parent.prototype;
  	}
  	// Proxy inherits from Parent's prototype (avoid Parent instance)
  	Ctor.prototype = Parent.prototype;
  	// Child inherits from proxy (requires an object, not function)
  	Child.prototype = new Ctor();
  	// Store reference to Child's 'super'
  	Child.super = Parent.prototype;
  	// Return extended constructor function
  	return Child;
  };
  
  /**
   * Determine if 'Child' Constructor inherits from 'Parent'
   * @param {Function} Child
   * @param {Function} Parent
   * @returns {Boolean}
   */
  exports.inheritsFrom = function (Child, Parent) {
  	if (typeof Child == 'function' && typeof Parent == 'function') {
  		if (Child === Parent) return true;
  		var descendant = Child.super;
  		while (descendant) {
  			if (descendant.constructor) {
  				if (descendant.constructor === Parent) return true;
  			}
  			descendant = descendant.constructor.super;
  		}
  	}
  	return false;
  };
  
  /**
   * Bind a function 'fn' to a specific 'context'
   * --from CoffeeScript boilerplate--
   * @param {Function} fn
   * @param {Object} context
   */
  exports.bind = function (fn, context) {
  	return function() {
  		return fn.apply(context, arguments);
  	};
  };
});
require.register('util.svg', function(module, exports, require) {
  var capabilities = require('env.capabilities');
  
  exports.NS = 'http://www.w3.org/2000/svg';
  exports.LINK = 'http://www.w3.org/1999/xlink';
  
  /**
   * Inject svg symbol definitions into the DOM
   * @param {String} id
   * @param {String} defs
   */
  exports.injectDefs = function (id, defs) {
  	if (capabilities.hasSVG() && !document.getElementById(id)) {
  		var el = document.createElement('div')
  			, svg = '<svg id="'
  					+ id
  					+ '" style="display:none;">'
  					+ defs
  					+ '</svg>';
  
  		el.innerHTML = svg;
  		document.body.insertBefore(el.firstChild, document.body.firstChild);
  	}
  };
  
  /**
   * Append svg element of 'type' to 'parent', setting 'attrs'
   * @parama {DOMElement} parent
   * @parama {String} type
   * @parama {Object} attrs
   */
  exports.appendChild = function (parent, type, attrs) {
  	var el = document.createElementNS(exports.NS, type);
  
  	if (attrs) {
  		for (var attr in attrs) {
  			if (attr.indexOf('xlink:') == 0) {
  				el.setAttributeNS(exports.LINK, attr.substring(6), attrs[attr]);
  			} else {
  				el.setAttribute(attr, attrs[attr]);
  			}
  		}
  	}
  
  	parent.appendChild(el);
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
  
  exports.env = {
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
  	ease: require('util.ease'),
  	log: require('util.log'),
  	number: require('util.number'),
  	identify: require('util.identify'),
  	object: require('util.object'),
  	svg: require('util.svg')
  };
  
});