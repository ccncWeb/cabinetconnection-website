/**
 * adaptor-build.com - Adaptor for build.com
 * @version v1.1.0
 * @environment production
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config = {
  accountKey:    '3f882ea63530564613012c955b0c3b84',
  domain:        'build.com',
  version:       '1.1.0',
  adaptorHost:   'my.fanplayr.com',
  adaptorScript: '//s3.amazonaws.com/fanplayr-assets/adaptors/build.com/build.com.js',
  widgetScript:  '//d1q7pknmpq2wkm.cloudfront.net/js/my.fanplayr.com/fp_smart.js',
  orderScript:   '//d1q7pknmpq2wkm.cloudfront.net/js/my.fanplayr.com/fp_custom_orders.js',
  logLevel:      'off'
};

var match = window.location.hostname.match(/(build\.\w+)/i);
if ( match ) {
  config.domain = match[1];
}

module.exports = config;

},{}],2:[function(require,module,exports){
var utils = require('./vendor/utils');

var slice = Array.prototype.slice;

function EventEmitter () {
}

EventEmitter.prototype.bind = EventEmitter.prototype.on = function ( event, fn ) {
  var events = this._events = this._events || {};
  var handlers = events[event] = events[event] || [];
  if ( utils.indexOf(handlers, fn) === -1 ) {
    handlers.push(fn);
  }
};

EventEmitter.prototype.unbind = EventEmitter.prototype.off = function ( event, fn ) {
  var events = this._events = this._events || {};
  if ( event in events === false ) {
    return;
  }
  var handlers = events[event];
  if ( handlers ) {
    if ( typeof fn !== 'undefined' ) {
      var index = utils.indexOf(handlers, fn);
      if ( index >= 0 ) {
        handlers.splice(index, 1);
      }
    } else {
      delete events[event];
    }
  }
};

EventEmitter.prototype.trigger = EventEmitter.prototype.emit = function ( event ) {
  var events = this._events = this._events || {};
  var handlers = events[event];
  if ( handlers ) {
    for ( var i = 0, len = handlers.length; i < len; i++ ) {
      handlers[i].apply(null, slice.call(arguments, 1));
    }
  }
};

EventEmitter.prototype.once = function ( event, fn ) {
  var that = this;
  var handler = function () {
    that.off(event, handler);
    fn.call(null, slice.call(arguments, 0));
  };
  this.on(event, handler);
};

EventEmitter.mixin = function ( obj ) {
  var methods = ['bind', 'on', 'unbind', 'off', 'trigger', 'emit', 'once'];
  var isClass = (typeof obj === 'function');
  for ( var i = 0, len = methods.length; i < len; i++ ) {
    var method = methods[i];
    if ( isClass ) {
      obj.prototype[method] = EventEmitter.prototype[method];
    } else {
      obj[method] = EventEmitter.prototype[method];
    }
  }
  return obj;
};

if ( typeof module !== 'undefined' && ('exports' in module) ) {
  module.exports = EventEmitter;
}

},{"./vendor/utils":13}],3:[function(require,module,exports){

var Logger     = require('./logger');
var log        = Logger.get('main');
var config     = require('./config');
var state      = require('./state');
var widget     = require('./widget');
var order      = require('./order');
var router     = require('./router');
var domReady   = require('./vendor/domReady');
var loadScript = require('./vendor/script');
var fanplayr = window.fanplayr = (window.fanplayr || {});
var $;

fanplayr.buildcom = (fanplayr.buildcom || {
  config: config,
  router: router,
  state:  state,
  widget: widget
});

var match = document.cookie.match(/\bfanplayr_adaptor_logger=(\w+)\b/i);
if ( match ) {
  Logger.setLevel(match[1]);
} else {
  Logger.setLevel(config.logLevel);
}

log.info('Version: (' + config.version + '); Account: (' + config.accountKey + '); Domain: (' + config.domain + '); Host: (' + config.adaptorHost +');');

if ( !config.domain ) {
  log.error('Must be run on build.com domain');
  return;
}

widget.on('changeSession', function () {
  log.info('Clearing state because session key changed');
  state._clear();
});

domReady(function () {

  if (window.location !== top.location) {
    return;
  }

  var start = function(_$) {

    $ = _$;

    state._load();

    router.init($, widget);

    state._save();

    log.info('state', JSON.stringify(state));

    widget.run();
  };

  var startTimeout;
  if (window.jQuery) {
    start(window.jQuery);
  }else{
    startTimeout = setTimeout(function(){
      if (window.jQuery) {
        clearTimeout(startTimeout);
        start(window.jQuery);
      }
    }, 500);
  }

});

},{"./config":1,"./logger":4,"./order":5,"./router":6,"./state":7,"./vendor/domReady":9,"./vendor/script":12,"./widget":14}],4:[function(require,module,exports){
(function () {

  var slice = Array.prototype.slice;

  function noOp () {
    // No operation.
  };

  function bind ( fn, that, arg1, condition ) {
    if(navigator.appName.indexOf("Internet Explorer")!=-1){
      var badBrowser = (
        navigator.appVersion.indexOf("MSIE 1") == -1      //v10, 11, 12, etc. is fine too
      );
      if (badBrowser) {
        return noOp;
      }
    }
    if ( condition && fn ) {
      if ( typeof fn.bind !== 'undefined' ) {
        if ( Function.prototype.bind ) {
          return Function.prototype.bind.call(fn, that, arg1);
        } else {
          if ( fn.apply ) {
            return function () {
              var args = slice.call(arguments, 0);
              args.unshift(arg1);
              fn.apply(that, args);
            };
          }
          return noOp;
        }
      }
      return fn.bind(that, arg1);
    }
    return noOp;
  }

  var levels = {
    1: 'debug', 'debug': 1,
    2: 'info',  'info':  2,
    3: 'warn',  'warn':  3,
    4: 'error', 'error': 4,
    9: 'off',   'off':   9
  };

  function parseLevel ( level ) {
    if ( typeof level === 'string' ) {
      return levels[level.toLowerCase()];
    }
    return level;
  }

  var loggersByName = {};

  function Logger ( name ) {
    this.name = name;
    this.setLevel(Logger.defaultLevel);
    this.levels = levels;
  }

  Logger.defaultLevel = levels.info;
  Logger.levels = levels;

  Logger.prototype.setLevel = function ( level ) {
    var level = parseLevel(level);
    if ( window.console ) {
      var name = '[' + this.name + ']';
      this.debug = bind(console.debug || console.log, console, name, level <= levels.debug);
      this.info  = bind(console.info  || console.log, console, name, level <= levels.info);
      this.warn  = bind(console.warn  || console.log, console, name, level <= levels.warn);
      this.error = bind(console.error || console.log, console, name, level <= levels.error);

      // Convenience alias.
      this.log = this.info;
    } else {
      this.debug = this.info = this.warn = this.error = noOp;
    }
    return this;
  };

  Logger.get = function ( name ) {
    name = name || '_';
    var logger = loggersByName[name];
    if ( !logger ) {
      logger = new Logger(name);
      loggersByName[name] = logger;
    }
    return logger;
  };

  Logger.setLevel = function ( level ) {
    Logger.defaultLevel = parseLevel(level);
    for ( var name in loggersByName ) {
      loggersByName[name].setLevel(level);
    }
  };

  Logger.enableAll = function ( level ) {
    Logger.setLevel(level || levels.log);
  };

  Logger.disableAll = function () {
    Logger.setLevel(levels.off);
  };
  module.exports = Logger;
/*
  // Expose to environment.
  if ( typeof define === 'function' && define.amd ) {
    define(Logger);
  } else if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = Logger;
  } else {
    window.Logger = Logger;
  }
 */
})();

},{}],5:[function(require,module,exports){
var log    = require('./logger').get('order');
var config = require('./config');
var state  = require('./state');
var script = require('./vendor/script');

function track ( errorNotes ) {
  var order = {
    accountKey: config.accountKey
  };

  var notes = 'build.com v' + config.version;
  var pageUrl = window.location.href;
  if ( pageUrl.length > 300 ) {
    pageUrl = pageUrl.substr(-300);
  }
  notes += '; ' + pageUrl;
  notes += '; ' + errorNotes;

  order.data = {
    shopType:      'custom',
    version:       3,

    tax:           state.tax || 0,
    shipping:      state.shipping || 0,
    discount:      state.discount || 0,
    discountCode:  state.discountCode || '',
    subTotal:      state.subTotal || 0,
    total:         state.total || 0,

    currency:      state.currency || 'USD',

    orderId:       state.orderId || '',
    orderNumber:   state.orderNumber || '',

    // Fanplayr will use the current GMT on the server if undefined.
    orderDate:     '',

    orderEmail:    state.orderEmail || '',
    customerEmail: state.customerEmail || '',

    firstName:     state.firstName || '',
    lastName:      state.lastName || '',

    products:      JSON.stringify(state.products || []),
    storeDomain:   config.domain,
    notes:         notes
  };

  log.debug('Order tracking data: ', order);

  window.fp_sales_orders = order;

  state._clear();

  script(config.orderScript, function () {
    log.debug('done');
  });
}

module.exports = {
  track: track
};

},{"./config":1,"./logger":4,"./state":7,"./vendor/script":12}],6:[function(require,module,exports){
var Router = require('./vendor/router');

var router = new Router();
var log     = require('./logger').get('router');
var state   = require('./state');
var order   = require('./order');
require('./vendor/json3.js');

var $, widget;
router.init = function ( jQuery, _widget ) {
  $ = jQuery;
  widget = _widget;
  router.run();
};

router.rule('A: All pages')
	.eval(function() {
		return true;
	})
	.define(function () {

		log.debug('running all pages rule');

	  state._load();

	  widget.disallow = true;

	  state.pageType = 'page';

	  waitForVariable('window.dataLayer', function( data ) {

			var path = document.location.pathname.toLowerCase();

			state.custom_data = state.custom_data || {};

			switch(data.page) {
				case 'main:home': state.pageType = 'home'; break;
				case 'main:browse':
				case 'browse:category':
				case 'search:browse':
						state.pageType = 'cat'; break;
				case 'product:display': state.pageType = 'prod'; break;
				case 'cart:cart': state.pageType = 'cart'; break;
				case 'checkout:ordercomplete': state.pageType = 'order'; break;
			}

			if (state.pageType == 'cat') {
				if (document.location.search.indexOf('?page=search') == 0) {
					state.pageType = 'srch';
				}
			}

			if (state.pageType == 'cat' || state.pageType == 'srch') {
				state.categoryName = textOf($('h1.header'));
				if (!state.categoryName) {
					state.categoryName = textOf($('h1[itemprop="name"]'));
				}
				var match = path.match(/c[0-9]+/);
				if (match && match.length == 1) {
					state.categoryId = match[0].substr(1);
				}
			}

			if (state.pageType == 'prod') {
				var $l = $('#breadcrumb a:last');
				if ($l.length){
					state.categoryName = $l.text();
					var m = $l.attr('href').match(/\/c([0-9]+)/);
					if (m && m.length == 2) {
						state.categoryId = m[1];
					}
				}
				state.productId = trim(textOf($('#titleProdId')));
				state.productPrice = numOf(textOf($('#productPrice')));
				state.productName = trim(textOf($('#titleName')));
				state.custom_data.manufacturer = trim(textOf($('#titleManufacturer')));

				var match = path.match(/s([^\/]+)/);
				if (match && match.length == 2) {
					state.productSku = match[1];
				}
			}

			if (state.pageType == 'cart') {

				// apply to cart?
				var match = window.location.search.match(/coupon_number=([^&]+)/);
				if (match && match.length == 2) {
					var coupon = match[1];
					var $f = $('#coupon_number');
					if ($f.length) {
						$f.val(coupon);
						$f.next().click();
						return;
					}
				}

				// first lets find product names
				var productNames = {};
				$('.product-title a').each(function(i, v){
					var $t = $(v);
					productNames[$t.attr('href').toLowerCase()] = $t.text();
				});

				var getProductName = function(id) {
					for (var k in productNames) {
						if (productNames.hasOwnProperty(k)) {
							if (k.indexOf(id.toLowerCase()) > -1) {
								return productNames[k];
							}
						}
					}
					return '';
				};

				var products = [];
				var lineItemCount = 0;
				var numItems = 0;

				if (data.cartItems) {
					for(var i=0; i<data.cartItems.length; i++) {
						var cp = data.cartItems[i];
						var p = {};
						p.id = cp.productId;
						p.name = getProductName(p.id);
						p.sku = cp.sku;
						p.qty = cp.quantity;
						p.price = cp.price;
						products.push(p);
						lineItemCount++;
						numItems += cp.quantity;
					}
				}

				if (data.couponCode) {
					state.discountCode = data.couponCode;
					// hack fix
					if (state.discountCode == 'false') {
						state.discountCode = '';
					}
				}

				state.subTotal = data.subTotal;
				state.discount = data.totalDiscount;
				state.total = state.subTotal - state.discount;
				state.products = products;
				state.lineItemCount = lineItemCount;
				state.numItems = numItems;
			}

			if (state.pageType == 'order') {

				widget.disallow = true;

				state.orderId = data.orderNumber;
				state.orderNumber = data.orderNumber;

				state.customerEmail = data.email;
				state.orderEmail = data.orderSummary ? data.orderSummary.orderEmail : data.email;
				state.firstName = data.firstName;
				state.lastName = data.lastName;

				state.shipping = data.orderSummary ? data.orderSummary.shippingCost : 0;
				state.tax = data.orderSummary ? data.orderSummary.totalTax : 0;

				state.discountCode = data.couponCode;
				state.discount = Math.abs(data.totalDiscount);

				state.subTotal = numOf(data.subTotal);
				state.total = state.subTotal - state.discount;

				var orderNote = '';

				// DO IT!
				order.track(orderNote);

				state._save();
			}else{
				state._save();

				widget.disallow = false;
				widget.run();
			}

	  });

	});

function decodeHtml( val ) {
	var div = document.createElement('div');
	div.innerHTML = val;
	return div.firstChild.nodeValue;
}

function firstEl(a) {
	if (a && a.length) {
		return a[0];
	}
	return null;
}

function waitForVariable( path, cb ) {
	var to = setTimeout( function(){
		if ( eval(path) ) {
			clearTimeout( to );
			cb( eval(path) );
		}
	}, 200);
}

function parseAmountText ( text, defaultValue ) {
  var match = typeof text === 'string' && text.match(/(-)?\s*([\d,\.]+)/);
  if ( match ) {
    var value = parseFloat(match[2].replace(/,/g, ''));
    if ( !isNaN(value) ) {
      return match[1] ? -value : value;
    }
  }
  return defaultValue || 0;
}

module.exports = router;


function numOf(s) {
  if (!isNaN(s)) return parseFloat(s);
  return s ? parseFloat(s.replace(/[^0-9-\.]?/g, '')) : 0;
}

function textOf($e) {
  return $e.length ? $e.text() : '';
}

function trim(s)
{
  if (!s) return '';
  return s.replace(/^\s+|\s+$/gm,'');
}

},{"./logger":4,"./order":5,"./state":7,"./vendor/json3.js":10,"./vendor/router":11}],7:[function(require,module,exports){
var log    = require('./logger').get('state');
var config = require('./config');
var cookie = require('./vendor/cookie');

// JSON support for older browsers.
require('./vendor/json3');

var JSON = window.JSON;

cookie.defaults.path = '/';
cookie.defaults.domain = '.' + config.domain;

var COOKIE_NAME = 'fanplayr_buildcom';

var state = new State();

function State () {
}

var persistent = [
  'lineItemCount',
  'numItems',
  'discount',
  'discountCode',
  'subTotal',
  'total',
  'products',
  'tax',
  'shipping'
];

function diff ( a, b ) {
  if ( (typeof a !== 'undefined' || typeof b !== 'undefined') && a !== b ) {
    log.debug('diff', a, b);
    return true;
  }
  return false;
}

State.prototype.getProductCount = function () {
  return state.products && state.products.length || 0;
};

State.prototype.getTotalQuantity = function () {
  var total = 0;
  if ( state.products ) {
    for ( var i = 0; i < state.products.length; i++ ) {
      total += state.products[i].qty;
    }
  }
  return total;
};

State.prototype.update = function ( obj ) {
  var didReset = false;

  for ( var key in obj ) {
    this[key] = obj[key];
  }

  return didReset;
};

State.prototype._save = function () {
  var data = {};

  for ( var i = 0; i < persistent.length; i++ ) {
    var key = persistent[i];
    if ( state.hasOwnProperty(key) ) {
      data[key] = state[key];
    }
  }

  var json = JSON.stringify(data);
  log.debug('saved', json);
  cookie.set(COOKIE_NAME, json, {
    expires: 1
  });
};

State.prototype._load = function () {
  var data = cookie.get(COOKIE_NAME);
  log.debug('load', data);
  if ( data && data.charAt(0) === '{' ) {
    data = JSON.parse(data);
    for ( var i = 0; i < persistent.length; i++ ) {
      var key = persistent[i];
      if ( data.hasOwnProperty(key) ) {
        state[key] = data[key];
      }
    }
  }
};

State.prototype._clear = function () {
  log.debug('clear');
  try {
    for ( var key in this ) {
      if ( this.hasOwnProperty(key) ) {
        delete this[key];
      }
    }
  } catch ( error ) {
  }
  this._save();

};

module.exports = state;

},{"./config":1,"./logger":4,"./vendor/cookie":8,"./vendor/json3":10}],8:[function(require,module,exports){
// Copyright (c) 2012 Florian H., https://github.com/js-coder https://github.com/js-coder/cookie.js

!function (document, undefined) {

	var cookie = function () {
		return cookie.get.apply(cookie, arguments);
	};

	var utils = cookie.utils =  {

		// Is the given value an array? Use ES5 Array.isArray if it's available.
		isArray: Array.isArray || function (value) {
			return Object.prototype.toString.call(value) === '[object Array]';
		},

		// Is the given value a plain object / an object whose constructor is `Object`?
		isPlainObject: function (value) {
			return !!value && Object.prototype.toString.call(value) === '[object Object]';
		},

		// Convert an array-like object to an array – for example `arguments`.
		toArray: function (value) {
			return Array.prototype.slice.call(value);
		},

		// Get the keys of an object. Use ES5 Object.keys if it's available.
		getKeys: Object.keys || function (obj) {
			var keys = [],
				 key = '';
			for (key in obj) {
				if (obj.hasOwnProperty(key)) keys.push(key);
			}
			return keys;
		},

		// Unlike JavaScript's built-in escape functions, this method
		// only escapes characters that are not allowed in cookies.
		escape: function (value) {
			return String(value).replace(/[,;"\\=\s%]/g, function (character) {
				return encodeURIComponent(character);
			});
		},

		// Return fallback if the value is not defined, otherwise return value.
		retrieve: function (value, fallback) {
			return value == null ? fallback : value;
		}

	};

	cookie.defaults = {};

	cookie.expiresMultiplier = 60 * 60 * 24;

	cookie.set = function (key, value, options) {

		if (utils.isPlainObject(key)) { // Then `key` contains an object with keys and values for cookies, `value` contains the options object.


			for (var k in key) { // TODO: `k` really sucks as a variable name, but I didn't come up with a better one yet.
				if (key.hasOwnProperty(k)) this.set(k, key[k], value);
			}

		} else {

			options = utils.isPlainObject(options) ? options : { expires: options };

			var expires = options.expires !== undefined ? options.expires : (this.defaults.expires || ''), // Empty string for session cookies.
			    expiresType = typeof(expires);

			if (expiresType === 'string' && expires !== '') expires = new Date(expires);
			else if (expiresType === 'number') expires = new Date(+new Date + 1000 * this.expiresMultiplier * expires); // This is needed because IE does not support the `max-age` cookie attribute.

			if (expires !== '' && 'toGMTString' in expires) expires = ';expires=' + expires.toGMTString();

			var path = options.path || this.defaults.path; // TODO: Too much code for a simple feature.
			path = path ? ';path=' + path : '';

			var domain = options.domain || this.defaults.domain;
			domain = domain ? ';domain=' + domain : '';

			var secure = options.secure || this.defaults.secure ? ';secure' : '';

			document.cookie = utils.escape(key) + '=' + utils.escape(value) + expires + path + domain + secure;

		}

		return this; // Return the `cookie` object to make chaining possible.

	};

	// TODO: This is commented out, because I didn't come up with a better method name yet. Any ideas?
	// cookie.setIfItDoesNotExist = function (key, value, options) {
	//	if (this.get(key) === undefined) this.set.call(this, arguments);
	// },

	cookie.remove = function (keys) {

		keys = utils.isArray(keys) ? keys : utils.toArray(arguments);

		for (var i = 0, l = keys.length; i < l; i++) {
			this.set(keys[i], '', -1);
		}

		return this; // Return the `cookie` object to make chaining possible.
	};

	cookie.empty = function () {

		return this.remove(utils.getKeys(this.all()));

	};

	cookie.get = function (keys, fallback) {

		fallback = fallback || undefined;
		var cookies = this.all();

		if (utils.isArray(keys)) {

			var result = {};

			for (var i = 0, l = keys.length; i < l; i++) {
				var value = keys[i];
				result[value] = utils.retrieve(cookies[value], fallback);
			}

			return result;

		} else return utils.retrieve(cookies[keys], fallback);

	};

	cookie.all = function () {

		if (document.cookie === '') return {};

		var cookies = document.cookie.split('; '),
			  result = {};

		for (var i = 0, l = cookies.length; i < l; i++) {
			var item = cookies[i].split('=');
			result[decodeURIComponent(item[0])] = decodeURIComponent(item[1]);
		}

		return result;

	};

	cookie.enabled = function () {

		if (navigator.cookieEnabled) return true;

		var ret = cookie.set('_', '_').get('_') === '_';
		cookie.remove('_');
		return ret;

	};

	// If an AMD loader is present use AMD.
	// If a CommonJS loader is present use CommonJS.
	// Otherwise assign the `cookie` object to the global scope.
module.exports = cookie;
/*
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return cookie;
		});
	// } else if (typeof exports !== 'undefined') {
	// 	exports.cookie = cookie;
	} else if (typeof module != 'undefined' && module.exports && this.module !== module) {
		module.exports = cookie;
	} else {
		window.cookie = cookie;
	}
*/
}(document);

},{}],9:[function(require,module,exports){
/*!
 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
 */
;(function (definition) {
  if (typeof module !== 'undefined' ) {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    // Register as an AMD module.
    define(definition);
  } else {
    // Browser globals
    window['onDomReady'] = definition();
  }
}(function() {
  return function ( fn, win ) {
    'use strict';

    win = win || window;

    var doc = win.document,
      docElem = doc.documentElement,

      LOAD = "load",
      FALSE = false,
      ONLOAD = "on"+LOAD,
      COMPLETE = "complete",
      READYSTATE = "readyState",
      ATTACHEVENT = "attachEvent",
      DETACHEVENT = "detachEvent",
      ADDEVENTLISTENER = "addEventListener",
      DOMCONTENTLOADED = "DOMContentLoaded",
      ONREADYSTATECHANGE = "onreadystatechange",
      REMOVEEVENTLISTENER = "removeEventListener",

      // W3C Event model
      w3c = ADDEVENTLISTENER in doc,
      top = FALSE,

      // isReady: Is the DOM ready to be used? Set to true once it occurs.
      isReady = FALSE,

      // Callbacks pending execution until DOM is ready
      callbacks = [];

    // Handle when the DOM is ready
    function ready( fn ) {
      if ( !isReady ) {

        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if ( !doc.body ) {
          return defer( ready );
        }

        // Remember that the DOM is ready
        isReady = true;

        // Execute all callbacks
        while ( fn = callbacks.shift() ) {
          defer( fn );
        }
      }
    }

    // The ready event handler
    function completed( event ) {
      // readyState === "complete" is good enough for us to call the dom ready in oldIE
      if ( w3c || event.type === LOAD || doc[READYSTATE] === COMPLETE ) {
        detach();
        ready();
      }
    }

    // Clean-up method for dom ready events
    function detach() {
      if ( w3c ) {
        doc[REMOVEEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
        win[REMOVEEVENTLISTENER]( LOAD, completed, FALSE );
      } else {
        doc[DETACHEVENT]( ONREADYSTATECHANGE, completed );
        win[DETACHEVENT]( ONLOAD, completed );
      }
    }

    // Defers a function, scheduling it to run after the current call stack has cleared.
    function defer( fn, wait ) {
      // Allow 0 to be passed
      setTimeout( fn, +wait >= 0 ? wait : 1 );
    }

    // Attach the listeners:

    // Catch cases where onDomReady is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( doc[READYSTATE] === COMPLETE ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      defer( ready );

    // Standards-based browsers support DOMContentLoaded
    } else if ( w3c ) {
      // Use the handy event callback
      doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );

      // A fallback to window.onload, that will always work
      win[ADDEVENTLISTENER]( LOAD, completed, FALSE );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      doc[ATTACHEVENT]( ONREADYSTATECHANGE, completed );

      // A fallback to window.onload, that will always work
      win[ATTACHEVENT]( ONLOAD, completed );

      // If IE and not a frame
      // continually check to see if the document is ready
      try {
        top = win.frameElement == null && docElem;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !isReady ) {
            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll("left");
            } catch(e) {
              return defer( doScrollCheck, 50 );
            }

            // detach all dom ready events
            detach();

            // and execute any waiting functions
            ready();
          }
        })();
      }
    }

    function onDomReady( fn ) {
      // If DOM is ready, execute the function (async), otherwise wait
      isReady ? defer( fn ) : callbacks.push( fn );
    }

    // Add version
    onDomReady.version = "1.4.0";
    // Add method to check if DOM is ready
    onDomReady.isReady = function(){
      return isReady;
    };

    onDomReady(fn);
  };
}));

},{}],10:[function(require,module,exports){
(function (global){
/*! JSON v3.3.0 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function (root) {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context.
  // Rhino exports a `global` function instead.
  var freeGlobal = typeof global == "object" && global;
  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the objectgs prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: A set of primitive types used by `isHostType`.
      var PrimitiveTypes = {
        "boolean": 1,
        "number": 1,
        "string": 1,
        "undefined": 1
      };

      // Internal: Determines if the given object `property` value is a
      // non-primitive.
      var isHostType = function (object, property) {
        var type = typeof object[property];
        return type == "object" ? !!object[property] : !PrimitiveTypes[type];
      };

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && isHostType(object, "hasOwnProperty") ? object.hasOwnProperty : isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (typeof filter == "function" || typeof filter == "object" && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "/",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (typeof exports == "object" && exports && !exports.nodeType && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, exports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON;
    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        root.JSON = nativeJSON;
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
var log = require('../logger').get('platform.router');
var utils = require('./utils');

function Router () {
  this.rules = [];
  this.log = log;
}

Router.log = log;

Router.prototype.define = function ( def, options ) {
  var rule = {};

  if ( typeof options !== 'object' ) {
    options = {};
  }

  if ( arguments.length === 1 ) {
    if ( typeof def === 'function' ) {
      // Don't bother evaluating the rule and just invoke it all the time.
      rule.eval = false;
      rule.callbacks = [def];
    } else {
      log.warn('Invalid rule definition');
      return this;
    }
  } else {
    if ( typeof def === 'function' ) {
      rule.eval = def;
    } else if ( typeof def === 'string' ) {
      rule.regExp = this.stringToRegExp(def);
    } else if ( def instanceof RegExp ) {
      rule.regExp = def;
    } else {
      log.warn('Invalid rule definition');
      return this;
    }

    if ( typeof options !== 'object' ) {
      rule.callbacks = Array.prototype.slice.call(arguments, 1);
    } else {
      rule.callbacks = Array.prototype.slice.call(arguments, 2);
    }
  }

  rule.options = options;
  log.debug('define', rule);

  this.rules.push(rule);

  return this;
};

Router.prototype.evalRule = function ( rule ) {
  if ( rule.eval === false ) {
    this.invokeRule(rule);
    return;
  } else if ( typeof rule.eval === 'function' ) {
    if ( rule.eval(rule) ) {
      this.invokeRule(rule);
      return;
    }
  } else {
    var locationParam = rule.options.location || 'pathname';
    if ( locationParam in document.location ) {
      var url = document.location[locationParam];
      if ( rule.regExp && rule.regExp.test(url) ) {
        this.invokeRule(rule);
        return;
      }
    } else {
      log.warn('Invalid location param "' + locationParam + '" for rule', rule);
    }
  }
  log.debug("Didn't match rule", rule);
};

Router.prototype.rule = function ( name ) {
  name = name || 'Unnamed Rule #' + this.rules.length;
  return new RouterRule(this, name);
};

Router.prototype.invokeRule = function ( rule ) {
  log.debug('Matched rule', rule.regExp);
  for ( var i = 0, len = rule.callbacks.length; i < len; i++ ) {
    rule.callbacks[i].call(rule.options.context || null, rule);
  }
};

Router.prototype.run = function () {
  log.debug('run');
  var skipped = [];
  for ( var i = 0, len = this.rules.length; i < len; i++ ) {
    var rule = this.rules[i];
    if ( rule._test() ) {
      if ( skipped.length ) {
        log.debug('Skipped (' + skipped.join(', ') + ')');
        skipped = [];
      }
      log.debug('Matched (' + rule.name + ')');
      for ( var j = 0, numCallbacks = rule.callbacks.length; j < numCallbacks; j++ ) {
        rule.callbacks[j].call(rule.context || null, rule);
      }
    } else {
      skipped.push(rule.name);
    }
  }

  if ( skipped.length ) {
    log.debug('Skipped (' + skipped.join(', ') + ')');
  }
};

function RouterRule ( Router, name ) {
  this._scraper = Router;
  this.name = name;
}

RouterRule.prototype.eval = function ( obj, locationPropertyOrFn ) {
  if ( typeof obj === 'string' ) {
    this.regExp = stringToRegExp(obj);
  } else if ( obj instanceof RegExp ) {
    this.regExp = obj;
  } else if ( typeof obj === 'function' ) {
    this.evalFn = obj;
  } else {
    log.warn('Invalid match param. Must be String or RegExp');
  }

  if ( this.regExp ) {
    if ( typeof locationPropertyOrFn === 'string' ) {
      if ( (locationPropertyOrFn in document.location) && typeof document.location[locationPropertyOrFn] === 'string' ) {
        this.locationProperty = locationPropertyOrFn;
      } else {
        log.warn('Invalid location property, "' + locationPropertyOrFn + '".');
      }
    } else if ( typeof locationPropertyOrFn === 'function' ) {
      this.evalInputFn = locationPropertyOrFn;
    } else {
      this.locationProperty = 'pathname';
    }
  }

  return this;
};

RouterRule.prototype.context = function ( context ) {
  this.context = context;
  return this;
};

RouterRule.prototype.define = function () {
  this.callbacks = Array.prototype.slice.call(arguments, 0);
  if ( utils.indexOf(this._scraper.rules, this) === -1 ) {
    this._scraper.rules.push(this);
  } else {
    log.warn('Attempted to define rule multiple times', rule);
  }
  return this._scraper;
};

RouterRule.prototype._test = function () {
  if ( this.regExp ) {
    if ( this.locationProperty ) {
      return this.regExp.test(document.location[this.locationProperty]);
    } else if ( this.evalInputFn ) {
      return this.regExp.test(this.evalInputFn(this));
    }
  } else if ( this.evalFn ) {
    return this.evalFn(this);
  }
  return false;
};

function stringToRegExp ( str ) {
  str = '^' + str.replace(/([\?\$\^\.\+\\\/\[\]\(\)])/g, '\\$1') + '$';
  str = str.replace(/\*/g, '.*');
  return new RegExp(str);
}

module.exports = Router;

},{"../logger":4,"./utils":13}],12:[function(require,module,exports){
/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      return !fn(el)
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function (path) {
        if (path === null) return callback()
        if (scripts[path]) {
          id && (ids[id] = 1)
          return scripts[path] == 2 && callback()
        }
        scripts[path] = 1
        id && (ids[id] = 1)
        create(!/^https?:\/\//.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script')
      , loaded = f
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = path
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});

},{}],13:[function(require,module,exports){
var arrayProto = Array.prototype;
var indexOfProto = arrayProto.indexOf;
var sliceProto = arrayProto.slice;

var indexOf;
if ( indexOfProto ) {
 indexOf = function ( array, item, fromIndex ) {
   return indexOfProto.apply(array, sliceProto.call(arguments, 1));
 };
} else {
 indexOf = function ( array, item, fromIndex ) {
   if ( typeof fromIndex === "undefined" ) {
     fromIndex = 0;
   }
   var length = array.length;
   if ( fromIndex < 0 ) {
     fromIndex += length;
   }
   if ( fromIndex < 0 ) {
     fromIndex = 0;
   }
   for ( var i = fromIndex; i < length; i++ ) {
     if ( array[i] === item ) {
       return i;
     }
   }
   return -1;
 };
}

module.exports = {
 indexOf: indexOf
};
},{}],14:[function(require,module,exports){
var log    = require('./logger').get('widget');
var config = require('./config');
var state  = require('./state');
var EE     = require('./event-emitter');
var script = require('./vendor/script');

var fanplayr = window.fanplayr = (window.fanplayr || {});

var lastJson = null;
var isReady = false;

var reinitializeData = null;

var widget = {};
widget.run = run;
EE.mixin(widget);

widget.disallow = false;

function initialize () {
  if ( !fanplayr._i ) {
    fanplayr._i = [];
  }

  if ( !fanplayr.widget ) {
    fanplayr.widget = {};
  }

  return fanplayr;
}

function buildData () {
  var built = {};

  built.accountKey = config.accountKey;

  built.type     = 'st';
  built.shopType = 'custom';

  built.data = {
    version:          3,
    discount:         state.discount || 0,
    couponCode:       state.discountCode || '',
    subTotal:         state.subTotal || 0,
    total:            state.total || 0,

    products:         JSON.stringify(state.products || []),
    lineItemCount:    state.getProductCount() || 0,
    numItems:         state.getTotalQuantity() || 0,

    pageType:         state.pageType || 'page',
    productId:        state.productId || null,
    productName:	    state.productName || null,
    productSku:       state.productSku || null,
    productPrice: 	  state.productPrice || null,
    categoryId:       state.categoryId,
    categoryName:     state.categoryName
  };

  built.custom_data = state.custom_data || {};
  built.applyToCartUrl = 'http://www.build.com/index.cfm?page=cart:cart&coupon_number=%c';

  return built;
}

function onLogVisit ( data ) {
  isReady = true;
  if ( reinitializeData ) {
    var copy = clone(reinitializeData);
    reinitializeData = null;
    fanplayr.reinitialize(copy);
  }
  widget.emit('logVisit', data);
}

function onChangeSession ( newKey, oldKey, data ) {
  widget.emit('changeSession', newKey, oldKey, data);
}

function extend() {
  for(var i=1; i<arguments.length; i++) {
    for(var key in arguments[i]) {
      if(arguments[i].hasOwnProperty(key)) {
        arguments[0][key] = arguments[i][key];
      }
    }
  }
  return arguments[0];
}

function clone ( obj ) {
  return extend({}, obj);
}

function run () {

  if (widget.disallow) {
    return;
  }

  initialize();

  var data = buildData();
  var json = JSON.stringify(data);

  // we have new data
  if ( lastJson !== json ) {
    lastJson = json;
    // we already have a widget
    if ( fanplayr._i.length ) {
      if ( isReady ) {
        fanplayr.reinitialize(clone(data));
      } else {
        reinitializeData = data;
      }
    // no data in widget yet, this is the first run
    } else {
      fanplayr._i.push(data);
      fanplayr.widget.onLogVisit      = onLogVisit;
      fanplayr.widget.onChangeSession = onChangeSession;

      script(config.widgetScript, function () {
        log.info('loaded widget');
      });
    }
  } else {
    log.debug('same data, skip widget');
  }
}

module.exports = widget;

},{"./config":1,"./event-emitter":2,"./logger":4,"./state":7,"./vendor/script":12}]},{},[3])