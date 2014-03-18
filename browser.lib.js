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
require.register('browser.lib', function(module, exports, require) {
  exports.util = {
  	polyfill: require('util.polyfill')
  };
  
  exports.dom = {
  	ready: require('dom.ready')
  };
  
  
});