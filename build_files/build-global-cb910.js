/*! GENERATED FILE. DO NOT EDIT. BuildStore - v0.1.0 - 2014-09-23 */
// javascript polyfills and shims.

// Lets you strip whitespace from the beginning and end of a string.
if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

if (typeof window.BCOM === "undefined") {
	window.BCOM = {
		'Utils': {}
	};
}
// Ensure we have pubsub
Backbone.View.prototype.pubSub = Backbone.View.prototype.pubSub || _.extend({}, Backbone.Events);


var OmnitureHelper = Backbone.View.extend({
	initialize: function() {
		// Favorites
		this.listenTo(this.pubSub, 'favorites:product:add', this._favoritesAddProduct);
		this.listenTo(this.pubSub, 'favorites', this._favorites);
		this.listenTo(this.pubSub, 'product:postalCheck', this._productPostalCheck);
	},

	getLocation: function() {
		var location;
		if (window.location.pathname.indexOf('index.cfm') !== -1) {
			location = window.dataLayer.page;
		} else {
			location = window.dataLayer.page.replace(/:.*/, ":") + window.location.pathname.replace(/\/[^\/]+\//, "");
		}
		return location;
	},

	_favorites: function(data) {
		window.s.linkTrackVars = 'events,server,eVar46,prop15,events';
		window.s.linkTrackEvents = 'event30';
		window.s.events = 'event30';
		window.s.eVar46 = [data.action, data.status, this.getLocation()].join(':');
		window.s.prop15 = window.s.eVar46;
		window.s.tl(this, 'o', 'Favorites Internal', null, function(){
			if (data.redirect) {
				window.location = data.redirect;
			}
		});

	},
	_favoritesAddProduct: function(data) {
		window.s.linkTrackVars = 'events,server,eVar46,prop15,events';
		window.s.linkTrackEvents = 'event30';
		window.s.events = 'event30';
		window.s.eVar46 = [data.action, data.status, data.listType, this.getLocation(), data.manufacturer, data.productId].join(':');
		window.s.prop15 = window.s.eVar46;
		window.s.tl(this, 'o', 'Favorites Internal', null, function(){
			if (data.redirect) {
				window.location = data.redirect;
			}
		});

	},
	_productPostalCheck: function(data) {
		window.s.linkTrackVars = 'events,server,eVar73';
		window.s.eVar73 = data;
		window.s.tl(true,'o','postalCheck');
	}
});

window.BCOM.Utils.Omniture = new OmnitureHelper();
// Feature & Browser Detection Goes on in Here.

/*  Modernizr Instructions:

  - Use the configurator on their site for including new features or removing ones: http://modernizr.com/download

  - Check to make sure you include all old features being detected when configuring new modernizr script.

  - Features can be found in the Modernizr Version Build Comment Below.

  - Important Modernizr Selections:
    - DON'T SELECT THE ADD CSS CLASS OPTION IN THE EXTRA PANEL. No need in manipulating the DOM when we don't need to.
    - Defaults on the extensibility panel are great.
    - If you are using non-core methods, you better have a good argument on why.
    - Don't include any extras. Yeah, there is some sweet stuff to be had. We will imlpement some of it later.
    NOTE ABOUT THE LAST ITEM: I had to include the 'yepnope loader' feature that it's in the 'extra' category, just to be able to load polyfills on the fly when it's needed.

  - Copy and paste a non-minified version for our sake, will be compressed later.

  - Yes, you can access window.Modernizr, but we will incorporate the results(along with the browser information) into the dataLayer for ease of use.
*/

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-borderradius-boxshadow-opacity-rgba-cssanimations-cssgradients-csstransforms-csstransforms3d-csstransitions-inputtypes-touch-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;

window.Modernizr = (function(window, document, undefined) {

    var version = '2.7.1',

        Modernizr = {},


        docElement = document.documentElement,

        mod = 'modernizr',
        modElem = document.createElement(mod),
        mStyle = modElem.style,

        inputElem = document.createElement('input'),

        smile = ':)',

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),


        tests = {},
        inputs = {},
        attrs = {},

        classes = [],

        slice = classes.slice,

        featureName,


        injectElementWithStyles = function(rule, callback, nodes, testnames) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },
        _hasOwnProperty = ({}).hasOwnProperty,
        hasOwnProp;

    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function(object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function() {

                    if (this instanceof bound) {

                        var F = function() {};
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed === 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false) {
                    return props[i];
                }
                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll(prop, prefixed, elem) {

        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }
    tests['touch'] = function() {
        var bool;

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    };
    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };
    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };



    tests['opacity'] = function() {
        setCssAll('opacity:.55');

        return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };
    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
            (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };
    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        if (ret && 'webkitPerspective' in docElement.style) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    function webforms() {
        Modernizr['inputtypes'] = (function(props) {

            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                if (bool) {

                    inputElem.value = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;

                        bool = defaultView.getComputedStyle &&
                            defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                            (inputElem.offsetHeight !== 0);

                        docElement.removeChild(inputElem);

                    } else if (/^(url|email)$/.test(inputElemType)) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                        bool = inputElem.value != smile;
                    }
                }

                inputs[props[i]] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


    Modernizr.addTest = function(feature, test) {
        if (typeof feature === 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {

            feature = feature.toLowerCase();

            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }

            test = typeof test === 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version = version;

    Modernizr._prefixes = prefixes;
    Modernizr._domPrefixes = domPrefixes;
    Modernizr._cssomPrefixes = cssomPrefixes;



    Modernizr.testProp = function(prop) {
        return testProps([prop]);
    };

    Modernizr.testAllProps = testPropsAll;


    Modernizr.testStyles = injectElementWithStyles;
    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a, b, c) {
    var l = b.documentElement,
        m = a.setTimeout,
        n = b.getElementsByTagName("script")[0],
        o = {}.toString,
        r = "MozAppearance" in l.style,
        s = r && !!b.createRange().compareNode,
        l = a.opera && "[object Opera]" === o.call(a.opera),
        l = !!b.attachEvent && !l,
        u = r ? "object" : l ? "script" : "img",
        w = Array.isArray || function(a) {
            return "[object Array]" === o.call(a);
        },
        x = [],
        y = {},
        z = {
            timeout: function(a, b) {
                return b.length && (a.timeout = b[0]), a;
            }
        },
        A, B;

    function d(a) {
        return "[object Function]" === o.call(a);
    }

    function e(a) {
        return "string" === typeof a;
    }

    function f() {}

    function g(a) {
        return !a || "loaded" === a || "complete" === a || "uninitialized" === a;
    }

    function h() {
        var a = p.shift();
        q = 1;
        a ? a.t ? m(function() {
            ("c" === a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
        }, 0) : (a(), h()) : q = 0
    }

    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && m(function() {
                    t.removeChild(l);
                }, 50);
                for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }
        var j = j || B.errorTimeout,
            l = b.createElement(a),
            r = 0,
            u = {
                t: d,
                s: c,
                e: f,
                a: i,
                x: j
            };
        1 === y[c] && (r = 1, y[c] = []), "object" === a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r);
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
    }

    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" === b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 === p.length && h()), this
    }

    function k() {
        var a = B;
        return a.loader = {
            load: j,
            i: 0
        }, a;
    }
    B = function(a) {
        function b(a) {
            var a = a.split("!"),
                b = x.length,
                c = a.pop(),
                d = a.length,
                c = {
                    url: c,
                    origUrl: c,
                    prefixes: a
                },
                e, f, g;
            for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++) c = x[f](c);
            return c;
        }

        function g(a, e, f, g, h) {
            var i = b(a),
                j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" === i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2;
            })))
        }

        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a)) c || (j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                    }), g(a, j, b, 0, h);
                    else if (Object(a) === a)
                        for (n in m = function() {
                            var b = 0,
                                c;
                            for (c in a) a.hasOwnProperty(c) && b++;
                            return b;
                        }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a), l();
                        } : j[n] = function(a) {
                            return function() {
                                var b = [].slice.call(arguments);
                                a && a.apply(this, b), l();
                            }
                        }(k[n])), g(a[n], j, b, n, h))
                } else {
                    !c && l();
                }
            }
            var h = !!a.test,
                i = a.load || a.both,
                j = a.callback || f,
                k = j,
                l = a.complete || f;
            c(h ? a.yep : a.nope, !!i), i && c(i);
        }
        var i, j, l = this.yepnope.loader;
        if (e(a)) g(a, 0, l, 0);
        else if (w(a)) {
            for (i = 0; i < a.length; i++) {
                j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
            }
        } else {
            Object(a) === a && h(a, l);
        }
    }, B.addPrefix = function(a, b) {
        z[a] = b;
    }, B.addFilter = function(a) {
        x.push(a);
    }, B.errorTimeout = 1e4, null === b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete";
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k = b.createElement("script"),
            l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d) {
            k.setAttribute(o, d[o]);
        }
        c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
        }, m(function() {
            l || (l = 1, c(1))
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var e = b.createElement("link"),
            j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d) {
            e.setAttribute(j, d[j]);
        }
        g || (n.parentNode.insertBefore(e, n), m(c, 0));
    }
})(this, document);
Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0));
};

/* Browser Detection Instructions

  - Taken and modified from http://www.quirksmode.org/js/detect.html

  - Removed a bunch of unneccessary stuff.

  - Added the iPad detect and changed OS to Device for our usage.

*/

var BrowserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown Device";
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            } else if (dataProp) {
                return data[i].identity;
            }
        }
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index === -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "OS X"
    }, {
        string: navigator.userAgent,
        subString: "iPad",
        identity: "iOS"
    }, {
        string: navigator.userAgent,
        subString: "Android",
        identity: "Android"
    }, {
        string: navigator.userAgent,
        subString: "Nexus",
        identity: "Nexus"
    }, {
        string: navigator.userAgent,
        subString: "Kindle",
        identity: "Kindle"
    }, {
        string: navigator.userAgent,
        subString: "Silk",
        identity: "Kindle"
    }]

};

BrowserDetect.init();

//Data Layer Insertion Pre DOM Ready.
var x;

window.browserDetect = {};
window.browserDetect.features = {};

window.browserDetect.client = BrowserDetect.browser;
window.browserDetect.version = BrowserDetect.version;
window.browserDetect.OS = BrowserDetect.OS;

for (x in Modernizr) {
    if ((Modernizr[x] === true) || (Modernizr[x] === false)) {
        window.browserDetect.features[x] = Modernizr[x];
    }
}

//jQuery closure for $ safety
(function($) {
	$.fx.speeds._default = 250;
	$.stdlib = {
		//WARNING: be careful how and where this function is used.  It is recommended it is only used to update field values when HTML encoded values are involved.
		unescapeHtml: function(text) {
			var div = $('<div/>').html(text),
				val = div.text();
			div.remove();
			return val;
		},
		//sets the value of fields whose names match the keys of the passed objects.
		setFields: function(obj, prefix, disable) {
			var toggleDisabled = typeof disable !== 'undefined';
			prefix = prefix || '';
			if (!obj) {
				return;
			}
			$.each(obj, function(k, v) {
				var $field = $('[name="' + prefix + k + '"]'),
					type = '';
				if ($field.length) {
					if ($field.length > 1 && $field.attr('type') === 'radio') {
						for (var i = 0, len = $field.length; i < len; i++) {
							if ($field[i].value === v) {
								$field[i].checked = true;
								break;
							}
						}
					} else {
						if ($field[0].type === "checkbox") {
							//HACK: Fragile, dependant on com.common.JSON.encode being dumb
							$field[0].checked = (v === "YES" || v === true || v === 1);
						} else {
							$field.val($.stdlib.unescapeHtml(v));
						}
					}
				}
				toggleDisabled && $field.toggleAttr("disabled", disable);
			});
		},
		isIE6: function() {
			return window.browserDetect.client === 'Explorer' && window.browserDetect.version < 7;
		},
		isIE7: function() {
			return window.browserDetect.client === 'Explorer' && window.browserDetect.version === 7;
		}

	};

	$.scrollTo = function(selector, settings) {
		var pos, top, frames;

		if (selector.length) {
			settings = $.extend({
				offset: {
					top: 0
				},
				onAfter: $.noop,
				duration: 0
			}, settings);
			pos = $(selector).offset();
			$('html,body').animate({
				scrollTop: pos.top + settings.offset.top
			}, settings.speed, settings.easing, function() {
				settings.onAfter();
			});
		}
	};
	$.fn.scrollTo = function() {
		$.scrollTo(this.first());
	};

	$.fn.smoothScroll = function(options) {
		var dfd = $.Deferred();
		options = $.extend({
			duration: 30,
			offset: {
				top: -10
			},
			onAfter: function() {
				dfd.resolve();
			}
		}, options);
		return dfd.promise(
			this.click(function(e) {
				$.scrollTo(this.hash, options);
				e.preventDefault();
			})
		);
	};

	//id itterator if the inputs don't have ids
	var phid = 0;
	$.fn.placeholder = function() {
		return this.bind({
			focus: function() {
				$(this).parent().addClass('placeholder-focus');
			},
			blur: function() {
				$(this).parent().removeClass('placeholder-focus');
			},
			'keyup input change': function() {
				$(this).parent().toggleClass('placeholder-changed', this.value !== '');
			}
		}).each(function() {
			var $this = $(this);
			//Adds an id to elements if absent
			if (!this.id) {
				this.id = 'ph_' + (phid++);
			}
			//Create input wrapper with label for placeholder. Also sets the for attribute to the id of the input if it exists.
			if (!$this.hasClass('form-control')) {
				$('<span class="placeholderWrap"><label for="' + this.id + '">' + $this.attr('placeholder') + '</label></span>')
					.insertAfter($this)
					.append($this);
				//Disables default placeholder
				$this.attr('placeholder', '').keyup();
			}

			//fixes lack of event for autocomplete in firefox < 4:'(
			if (window.browserDetect.client === "Firefox" && window.browserDetect.version < "4") {
				$this.focus(function() {
					var val = this.value,
						el = this,
						$el = $(this);
					$el.data('ph_timer', setInterval(function() {
						if (val !== el.value) {
							$el.change();
						}
					}, 100));
				}).blur(function() {
					clearTimeout($(this).data('ph_timer'));
				});
			}
		});
	};

	$.fn.smartColumns = function(minWidth) {
		var containers = this,
			settings = typeof minWidth === 'number' ? {
				minWidth: minWidth
			} : minWidth,
			options = $.extend({
				minWidth: 200,
				maxWidth: 300,
				normalizeHeight: false,
				expandColumns: false,
				maxColumns: 0
			}, settings);

		function eResize() {
			var container = $(this),
				originalStyles;
			//unbind to prevent IE event loop
			var startWidth,
				$hiddenParent;
			if (container.is(':visible')) {
				startWidth = container.width();
			} else {
				$hiddenParent = container.parents(':hidden:last');
				originalStyles = $hiddenParent.attr('style');
				$hiddenParent.css("display", "block");
				startWidth = container.width();
				if (originalStyles) {
					$hiddenParent.attr('style', originalStyles);
				} else {
					$hiddenParent.css("display", "");
				}
			}
			var opts = ($(container).data('smartcolumns') ? $(container).data('smartcolumns').options : options),
				cols = container.children(),
				minWidth = opts.maxColumns > 0 ? Math.max(opts.minWidth, Math.floor(startWidth / opts.maxColumns)) : opts.minWidth,
				numCols = Math.floor(startWidth / minWidth),
				colFixed = Math.floor(startWidth / numCols);

			if (opts.expandColumns && cols.length < numCols) {
				colFixed = Math.min(opts.maxWidth, Math.floor(startWidth / cols.length));
			}

			cols.css({
				width: colFixed,
				height: 'auto'
			});

			//Normalize Row Height
			if (opts.normalizeHeight) {
				var maxHeight = [0],
					groups = [
						[]
					],
					curGroup = 0;
				for (var i = 0, len = cols.length; i < len; i++) {
					if (i !== 0 && i % numCols === 0) {
						groups.push([]);
						maxHeight.push(0);
						curGroup += 1;
					}
					groups[curGroup].push(cols[i]);
					if ($(cols[i]).is(':hidden')) {
						$hiddenParent = $(cols[i]).parents(':hidden:last');
						originalStyles = $hiddenParent.attr('style');
						$hiddenParent.css("display", "block");
						maxHeight[curGroup] = Math.max(maxHeight[curGroup], $(cols[i]).height());
						if (originalStyles) {
							$hiddenParent.attr('style', originalStyles);
						} else {
							$hiddenParent.css("display", "");
						}
					} else {
						maxHeight[curGroup] = Math.max(maxHeight[curGroup], $(cols[i]).height());
					}
				}
				for (i = 0, len = groups.length; i < len; i++) {
					$(groups[i]).height(maxHeight[i]);
				}
			}
		}

		if (containers.length) {
			containers.each(function() {
				var $t = $(this),
					sc = $t.data('smartcolumns');

				if (!sc) {
					var resizeFunc = _.debounce($.proxy(eResize, this), 100),
						container = $(window).resize(resizeFunc).resize();

					$t.data('smartcolumns', {
						resize: resizeFunc,
						options: options
					});

					$t.find('img').on('load', resizeFunc);
				} else {
					sc.options = options;
					sc.resize();
				}
			});
		}
		return containers;
	};


	//Toggle boolean attributes. Works like $.fn.toggleClass
	//toggle bool optional. Sets the attr regardless of hasAttr
	$.fn.toggleAttr = function(attr, override) {
		//toggle based on hasAttr
		if (typeof override === "undefined") {
			this.each(function() {
				var $this = $(this);
				$this.hasAttr(attr) ? $this.removeAttr(attr) : $this.attr(attr, attr);
			});
		}
		//toggle based on override
		else {
			override ? this.attr(attr, attr) : this.removeAttr(attr);
		}
		return this;
	};

	//Tabs!
	//Does: Use delegation, Load based on #hash
	//Doesn't: Support back button, have special ajax support

	//Prototype TabControl object
	var TabControl = function() {};
	$.extend(TabControl.prototype, {
		init: function($container, options) {
			var hashLookup = $(window.location.hash);
			this.options = $.extend({
					tabs: '.tabs li, .heading li',
					panes: '.tabPane',
					disableHash: true,
					cycle: false,
					cycleDelay: 8000,
					cycleStopOnHover: true
				},
				options || {});
			this.$container = $container;
			this.$tabs = this.$container.find(this.options.tabs);
			this.$panes = this.$container.find(this.options.panes);
			this.bindEvents();
			//HACKY Open tab if in hash
			if ((window.location.hash.length > 1) && ($(window.location.hash + ".tabPane").length)) {
				$("a[href='" + window.location.hash + "']").mousedown().click();
			} else if (hashLookup.length && hashLookup.closest($container).length) {
				hashLookup.mousedown().click();
			}

			if (this.options.cycle) {
				this.startCycle();
			}

			return this;
		},
		bindEvents: function() {
			var self = this;
			self.$tabs.on('mousedown', 'a', function(e) {
				if (!$(this).hasClass('notab')) {
					self.index = $(this).parent().index();
					self.$container.trigger('tabShow', [self]);
				}
			}).click(function(e) {
				self.options.disableHash && e.preventDefault();
			});
			self.$container.on('tabShow', function(e, tabControl) {
				tabControl.$panes.removeClass('on').eq(tabControl.index).addClass('on');
				tabControl.$tabs.removeClass('on').eq(tabControl.index).addClass('on');
			});
		},
		resetTimer: function() {
			if (this.cycleSettings.timer) {
				clearTimeout(this.cycleSettings.timer);
			}

			this.cycleSettings.timer = setTimeout(_.bind(this.cycleFunc, this), this.options.cycleDelay);
		},
		cycleFunc: function() {
			var self = this,
				tabCount = self.$tabs.length,
				activeTab = self.$tabs.filter('.on'),
				activeTabIndex = activeTab.index(),
				newTabIndex = (activeTabIndex + 1) % tabCount;

			if (!self.cycleSettings.hover) {
				self.index = newTabIndex;
				self.$container.trigger('tabShow', [self]);
				self.cycleSettings.mouseOutAction = null;
			} else {
				self.cycleSettings.mouseOutAction = function() {
					self.index = newTabIndex;
					self.$container.trigger('tabShow', [self]);
					self.cycleSettings.mouseOutAction = null;
				};
			}
		},
		startCycle: function() {
			var self = this;

			self.cycleSettings = {
				hover: false,
				mouseOutAction: null
			};

			if (self.options.cycleStopOnHover) {
				self.$container.hover(
					function() {
						self.cycleSettings.hover = true;
					},
					function() {
						self.cycleSettings.hover = false;
						if (self.cycleSettings.mouseOutAction) {
							self.cycleSettings.mouseOutAction();
						}
					}
				);
			}

			this.$container.on('tabShow', function() {
				self.resetTimer();
			});

			self.resetTimer();
		}
	});

	//Adds to jQuery.fn
	$.fn.tabControl = function(options) {
		return this.each(function() {
			$.data(this, 'tabControl', new TabControl().init($(this), options));
		});
	};
	$.fn.toggleTarget = function(speed) {
		speed = speed || 0;
		return this.on('click', function(e) {
			var $this = $(this),
				$t = $(this.hash),
				openText = $this.data('opentext'),
				closedText = $this.data('closedtext'),
				_speed = +$this.data('speed') || speed;
			if ($t.is(':visible')) {
				$t.slideUp(_speed);
				closedText && $this.text(closedText);
			} else {
				$t.slideDown(_speed);
				openText && $this.text(openText);
			}
			e.preventDefault();
		});
	};
	$.fn.checkToggleTarget = function(reverse) {
		return this.on('change load', function() {
			$($(this).data('target')).toggleClass('hide', reverse ? this.checked : !this.checked);
		});
	};

	$.fn.selectShowTarget = function() {
		return this.each(function() {
			var targetsSelector = [];
			$(this.options).each(function() {
				var target = $(this).data('target');
				if (target) {
					targetsSelector.push(target);
				}
			});
			$(this).data('targets', $(targetsSelector.join(',')));
		}).on('change', function() {
			var $option = $(this.options[this.selectedIndex]);
			$(this).data('targets').hide();
			$($option.data('target')).show();
		}).change();
	};
	$.fn.popupWindow = function(instanceSettings) {
		return this.on('click', function(e) {
			var data = $(this).data(),
				settings = $.extend({}, $.fn.popupWindow.defaultSettings, instanceSettings || {}, data),
				windowFeatures = [];
			settings.href = this.href || settings.href;
			e.preventDefault();
			e.stopPropagation();
			if (settings.centerBrowser) {
				//hacked together for IE browsers
				if (window.browserDetect.client === 'Explorer') {
					settings.left = window.screenLeft + ((document.body.offsetWidth + 20) / 2) - (settings.width / 2);
					settings.top = window.screenTop - 120 + ((document.documentElement.clientHeight + 120) / 2) - (settings.height / 2);
				} else {
					settings.left = window.screenX + (window.outerWidth / 2) - (settings.width / 2);
					settings.top = window.screenY + (window.outerHeight / 2) - (settings.height / 2);
				}
			} else if (settings.centerScreen) {
				settings.left = (screen.width - settings.width) / 2;
				settings.top = (screen.height - settings.height) / 2;
			}
			for (var k in {
				width: 1,
				height: 1,
				toolbar: 1,
				scrollbars: 1,
				status: 1,
				resizable: 1,
				location: 1,
				menubar: 1,
				left: 1,
				top: 1
			}) {
				windowFeatures.push(k + "=" + settings[k]);
			}
			windowFeatures = windowFeatures.join(',');
			window.open(
				settings.href,
				settings.windowName,
				windowFeatures + ',left=' + settings.left + ',top=' + settings.top
			).focus();
		});
	};
	$.fn.popupWindow.defaultSettings = {
		centerBrowser: 0, // center window over browser window? {1 (YES) or 0 (NO)}. overrides top and left
		centerScreen: 0, // center window over entire screen? {1 (YES) or 0 (NO)}. overrides top and left
		height: 500, // sets the height in pixels of the window.
		left: 0, // left position when the window appears.
		location: 1, // determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
		menubar: 0, // determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
		resizable: 1, // whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
		scrollbars: 1, // determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
		status: 0, // whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
		width: 650, // sets the width in pixels of the window.
		windowName: '_blank',
		href: null, // url used for the popup
		top: 0, // top position when the window appears.
		toolbar: 0 // determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
	};

	$.fn.trimmedVal = function() {
		return $.trim(this.val());
	};

	$.fn.hoverClass = function(className) {
		className = className || 'hover';
		return this.hover(function() {
			$(this).addClass(className);
		}, function() {
			$(this).removeClass(className);
		});
	};

	//RadPicker - Radio Group selection and edit widget, as seen on the payment page
	//NOTE relies on a lot of traversal, could store references to related elements better
	//TODO This is too big and specific, should be moved to separate js file
	var _radPickerInited = false;

	function RadPicker(el) {
		var $link, $rads, $rad;
		this.$el = $(el);
		this.$radForm = this.$el.find('.radForm').eq(0);
		this.$radForm.addClass('off');
		this.$errorFields = this.$radForm.find('.error');
		this.$errorMessages = this.$radForm.find('.inlineerror');
		this.formOpen = this.$radForm.is(':visible');
		this.$update = this.$radForm.find('.update').eq(0);
		this.$delete_list = this.$radForm.find('.delete_list').eq(0);
		this.delete_list_array = [];
		this.editing = this.$update.val() == 1;
		$rads = this.$el.children().children('.rad');
		this.$editLinks = $rads.find('.edit');
		this.bindEvents();
		(!_radPickerInited) && this.globalInit();
		if (this.editing) {
			$rad = $rads.find(':checked').closest('.rad');
			$link = $rad.find('.edit').first();
			this.openEdit($link, $rad);
		}
	}
	RadPicker.prototype = {
		formOpen: false,
		//This is only run once
		globalInit: function() {
			_radPickerInited = true;
			//These event handlers are shared across all instances.
			$('.radPicker .edit').on('click', function(e) {
				e.preventDefault();
				$(this).closest('.radPicker').trigger('edit', [this]);
			});
			$('.radPicker .delete').on('click', function(e) {
				e.preventDefault();
				$(this).closest('.radPicker').trigger('delete', [this]);
			});
			$('.radPicker .rad').on('click', 'input', function(e) {
				if (!$(e.currentTarget).hasClass('stopRadPicker')) {
					$(this).closest('.radPicker').trigger('choose', [$(e.target).parent()]);
				}
			});
		},
		bindEvents: function() {
			this.$el.bind({
				'edit': $.proxy(this.eEdit, this),
				'delete': $.proxy(this.eDelete, this),
				'choose': $.proxy(this.eChoose, this),
				'cancel': $.proxy(this.eCancelEdit, this)
			});
		},
		eCancelEdit: function(e, link) {
			var $link = $(link),
				$rad = $link.closest('.rad');
			e.stopPropagation();
			if (this.formOpen && this.$radForm.prev().get(0) === $rad.get(0)) {
				this.cancelEdit();
			}
		},
		eEdit: function(e, link) {
			var $link = $(link),
				$rad = $link.closest('.rad');
			e.stopPropagation();
			if (this.formOpen && this.$radForm.prev().get(0) === $rad.get(0)) {
				this.cancelEdit();
			} else {
				this.clearErrorMessages();
				this.openEdit($link, $rad);
			}
		},
		eDelete: function(e, link) {
			var $link = $(link),
				$rad = $link.closest('.rad');

			e.stopPropagation();
			this.cancelEdit();

			var $t = $(this);
			var $radio = $rad.find(':radio');
			var $radPicker = $t.closest('.radPicker');
			var $editLink = $rad.find('.edit').hide();
			this.delete_list_array.push($radio.val());
			this.$delete_list.val(this.delete_list_array.join(','));

			var $delMsgDiv = $('<div><span class="delete_msg">Flagged for deletion </span></div>');

			$link.hide();

			$('<a />', {
				text: 'Undo',
				href: '#',
				click: $.proxy(function(e) {
					$radio.attr('disabled', false);
					$delMsgDiv.remove();
					//remove id from list
					this.delete_list_array = [];
					var current_delete_list = this.$delete_list.val().split(',');
					var list_length = current_delete_list.length;

					for (var i = 0; i < list_length; i++) {
						if ($radio.val() !== current_delete_list[i]) {
							this.delete_list_array.push(current_delete_list[i]);
						}
					}

					this.$delete_list.val(this.delete_list_array.join(','));

					$editLink.show();
					$link.show();
				}, this)
			}).addClass('undo').appendTo($delMsgDiv);

			if ($radPicker.hasClass('pickerRequired') && $radio.attr('checked')) {
				var $rp = $rad.closest('.radPicker'),
					$next = $rp.find('.rad').filter(':not([class~=deleted])').first();
				$next.find('input').trigger('click');
			}

			$radio.attr('checked', false).attr('disabled', true);
			$rad.find('label.radLabel').after($delMsgDiv);
		},
		eChoose: function(e, target) {
			var $target = $(target),
				$link = $target.next('.edit'),
				$rad, alreadyOpen;
			e.stopPropagation();
			$rad = $target.closest('.rad');
			if ($rad.parent().find('.radForm:visible').length) {
				return;
			}
			if ($target.hasClass('new')) {
				this.clearErrorMessages();
				this.openEdit($link, $rad);
			} else {
				this.cancelEdit();
			}
		},
		cancelEdit: function() {
			this.$editLinks.text('Edit');
			this.$radForm.addClass('off').slideUp(200);
			this.$update.val(0);
			this.formOpen = false;
		},
		openEdit: function($link, $rad) {
			$rad.find('input').get(0).checked = true;
			this.$editLinks.text('Edit');
			$link.text('Cancel');
			this.$radForm.insertAfter($rad);
			this.$radForm.removeClass('off').show();
			this.formOpen = true;
			if (!this.editing) {
				$.stdlib.setFields($rad.data('values'), this.$el.data('prefix'));
				if ($rad.data('values').showErrors === "YES") {
					this.$radForm.find('.error-message').show();
				} else {
					this.$radForm.find('.error-message').hide();
					this.$radForm.find('.has-warning').removeClass('has-warning');
				}
				//HACK
				$('select.country').change();
			}
			//	must set update value after setFields or setFields will set $update.val(0)
			this.$update.val(1);
			this.editing = false;
		},
		clearErrorMessages: function() {
			this.$errorFields.removeClass('error');
			this.$errorMessages.remove();
		}
	};

	$(function() {
		document.documentElement.className = document.documentElement.className.replace(/\bnot-ready\b/, '');
		$('a[rel~=popup]').popupWindow();
		$('input[placeholder]').not('.favoriteable').placeholder();
		$('.scroll,.skipTo a').smoothScroll();
		$('.radPicker').each(function() {
			new RadPicker(this);
		});
		$('.tabControl').tabControl();
		$('.cycle-wrapper').tabControl({
			cycle: true
		});
		$('select.showTarget').selectShowTarget();
		$('a.toggleTarget').toggleTarget();
		$('.radGroup').on('change', function(e) {
			var $target = $(e.target);
			if ($target.is(':radio')) {
				$target.closest('li').addClass('on').siblings().removeClass('on');
			}
		}).find(':checked').change();

		//HTML5 autofocus
		if (('autofocus' in document.createElement('input')) === false) {
			$('input[autofocus]').eq(0).focus();
		}

		//lazy load validation.
		var $formValidate = $('form.validate');
		if ($formValidate.length) {
			$.getScript('/themes/build/scripts/jquery/validation.js');
		}

		//HACK country selects like on payment page.
		$('select.country').on('change', function() {
			var $opt = $(this.options[this.selectedIndex]),
				$target = $($opt.data('target'));
			$target.siblings('select').attr('disabled', 'disabled').hide().end()
				.removeAttr('disabled').show();
		}).change();
	});

	if ($.stdlib.isIE6()) {
		$(".hoverClass").hoverClass('hover');
	}
})(jQuery);

(function($) {
	$.fn.optip = function(options) {
		//: Default configuration object
		options = $.extend({}, $.optip.defaults, options);
		var $content = options.contentSelector ? $(options.contentSelector, options.tooltip) : options.tooltip;
		var tooltipHoverState = false;
		options.tooltip.appendTo("body").hide();
		this.each(function() {
			var $this = $(this),
				target = $this.data('target');
			if (target) {
				$this.data("ttcontent", $(target).html());
			} else if (this.rel && this.rel.indexOf("tooltip") >= 0) {
				//if remote
				if (!this.hash && this.pathname !== document.location.pathname) {
					$this.data("tthref", this.href);
					$this.removeAttr('href');
				} else {
					$this.data("ttcontent", $(this.hash).html());
					$this.removeAttr('href');
				}
			} else {
				$this.data("ttcontent", this.title).removeAttr("title");
			}
		}).addClass("tton");

		function over(e) {
			var $t = $(e.target).closest(".tton").addClass("optipLoading"),
				_options = $.extend({}, options, $t.data('ttsettings'));

			(function() {
				return jQuery.Deferred(function(dfd) {
					var href = $t.data("tthref");
					if (href) {
						$.ajax({
							url: href,
							cache: _options.cache
						}).done(function(data) {
							$t.data("ttcontent", data);
							dfd.resolve();
						});
					} else {
						dfd.resolve();
					}
				}).promise();
			})().done(function() {
				var $win = $(window),
					tpos, bottomDiff;

				if (_options.noHoverOnChildren) {
					e.target = $(e.target).closest('.tton');
				}

				$t.removeClass('optipLoading');
				$content.html($t.data("ttcontent"));
				if (typeof _options.position === 'string') {
					_options.position = $.optip.positions[_options.position] || $.optip.defaults.position;
				}

				//need to set the tooltip class before calculating position
				_options.tooltip.addClass(_options.tooltipClass);

				tpos = _options.position(e, _options.tooltip);
				tpos.top += _options.offset.top;
				tpos.left += _options.offset.left;

				bottomDiff = (tpos.top + _options.tooltip.height()) - ($win.scrollTop() + $win.height());

				if (bottomDiff > 0) {
					tpos.top -= bottomDiff + 60;
				}

				_options.tooltip.css({
					top: tpos.top,
					left: tpos.left
				});
				_options.show.call(_options.tooltip, e);
			});
		}

		function out(e) {
			if (tooltipHoverState) {
				return;
			}
			var $t = $(e.target).closest(".tton"),
				_options = $.extend({}, options, $t.data('ttsettings'));

			options.tooltip.removeClass(_options.tooltipClass);
			options.hide.call(options.tooltip, e);
		}

		if ('ontouchstart' in document.documentElement) {
			// This used the deprecated version of $.fn.toggle(), hence the funky logic here.
			this.on('click', function(e) {
				e.stopPropagation();
				e.preventDefault();

				var iteration = $(this).data('iteration') || 1;

				if (iteration === 1) {
					over(e);
				} else if (iteration === 2) {
					out(e);
				}

				iteration++;
				if (iteration > 2) {
					iteration = 1;
				}
				$(this).data('iteration', iteration);
			});
		} else {
			//use hoverIntent if included
			//
			if ($.fn.hoverIntent) {
				//extend hoverIntent with options.hoverOpts
				this.hoverIntent($.extend({
					"over": over,
					"out": out
				}, options.hoverOpts));
			} else {
				this.hover(over, out);
			}
		}

		return this;
	};
	$.optip = {
		//:Some basic functions for positioning the tooltips
		positions: {
			topcenter: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				tpos.left -= ($tooltip.width() - $t.width()) / 2;
				tpos.top -= $tooltip.height() + 5;
				$tooltip.hide();
				return tpos;
			},
			bottomleft: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				//y bottom + 10px
				tpos.top += $t.height();
				$tooltip.hide();
				return tpos;
			},
			topleft: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				//y=top-tooltip height-6
				tpos.left -= $tooltip.width() + 15;
				$tooltip.hide();
				return tpos;
			},
			bottomright: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				//y=top-tooltip height-6
				tpos.left += $t.width() - $tooltip.width();
				//y bottom + 10px
				tpos.top += $t.height() + 10;
				$tooltip.hide();
				return tpos;
			},
			centercenter: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				tpos.left += ($t.width() - $tooltip.width()) / 2;
				//y=top-tooltip height-6
				tpos.top += ($t.height() - $tooltip.height()) / 2;
				$tooltip.hide();
				return tpos;
			},
			centerright: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				tpos.left += $t.width();
				//y=top-tooltip height-6
				tpos.top -= $tooltip.show().height() / 2;
				$tooltip.hide();
				return tpos;
			},
			topright: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset();
				tpos.left += $t.width();
				$tooltip.hide();
				return tpos;
			},
			autoleftright: function(e, $tooltip) {
				var $t = $(e.target),
					tpos = $t.offset(),
					twidth = $t.width(),
					ttwidth = $tooltip.show().width(),
					windowLeft = $(window).width();

				if ((tpos.left + ttwidth + twidth) < windowLeft) {
					//right placement
					tpos.left += twidth;
				} else {
					//left placement
					tpos.left -= ttwidth;
				}

				$tooltip.hide();
				return tpos;
			}

		},
		defaults: {
			tooltip: $('<div></div>'),
			tooltipClass: 'tooltipBox',
			contentSelector: null,
			show: function() {
				this.show();
			},
			hide: function() {
				this.hide();
			},
			// options for hover delay. see http://cherne.net/brian/resources/jquery.hoverIntent.html
			hoverOpts: {},
			// function(hoverEvent,$tooltip) - Computes position of tooltip.
			position: 'bottomleft',
			//passed to the ajax call in remote tooltips
			cache: true,
			offset: {
				top: 0,
				left: 0
			}
		}
	};
})(jQuery);

jQuery(function($) {
	var suggestTimeout = 0,
	    keyDelay       = 150,
	    blurDelay      = 500,
	    $suggestionsXhr;

	function hideSuggestions() {
		$('#autoSuggest').hide();
	}

	function showSuggestions() {
		$('#autoSuggest').show();
	}

	function getSuggestions() {
		var $searchInput = $('#searchInput'),
			searchInputVal = $searchInput.val(),
			$load = $('.searchLoad');

		if ($searchInput.val().length > 1 && dataLayer.siteId > 0 && dataLayer.storeId > 0) {
			if ($suggestionsXhr) {
				$suggestionsXhr.abort();
			}
			$suggestionsXhr = $.ajax({
				url: "/api/search/suggest?term=" + encodeURIComponent($searchInput.val()) + '&siteid=' + dataLayer.siteId + '&storeid=' + dataLayer.storeId,
				context: document.body,
				beforeSend: function() {
					$load.show();
				}
			}).done(function(suggestHtml) {
				$suggestionsXhr = 0;
				$load.hide();

				if (!suggestHtml.length) {
					hideSuggestions();
				} else {
					$('#autoSuggest').empty().append(suggestHtml);
					showSuggestions();
				}
			});
		} else {
			hideSuggestions();
		}
	}

	function cycleItems(direction) {

		var $listItems = $('#autoSuggest li'),
			$active = $('#autoSuggest li.hover');

		if ($listItems.length) {
			if (direction === 'up') {
				if ($active.length) {
					$active.removeClass('hover');
					// set data id for each list item from backend
					var $prevItem = $listItems.eq($active.data('id') - 1);

					// if prev data id is less than zero go to last child
					if ($prevItem.length) {
						$prevItem.addClass('hover');
					} else {
						//  pressing up on first child will add .hover to last child
						$listItems.last().addClass('hover');
					}
				} else {
					$listItems.last().addClass('hover');
				}
			} else if (direction === 'down') {
				if ($active.length) {
					$active.removeClass('hover');
					var $nextItem = $($listItems[$active.data('id') + 1]);

					if ($nextItem.length) {
						$nextItem.addClass('hover');
					} else {
						$listItems.first().addClass('hover');
					}
				} else {
					// pressing down on last child will add .hover to first child
					$listItems.first().addClass('hover');
				}
			}
		}
	}

	$('#autoSuggest').on('hover', 'li', function() {
		var $listItems = $('#autoSuggest li'),
			$active = $('#autoSuggest li.hover'),
			$this = $(this);

		if ($active.length) {
			$listItems.removeClass('hover');
		}
		$this.toggleClass('hover');
	});

	$("#searchInput").on('keyup', function(e) {
		var key = e.keyCode,
			keyArr = [8, 13, 32, 37, 38, 39, 40];

		clearTimeout(suggestTimeout);

		if ($('#searchInput').val().length > 1) {
			// avoid timeout on non-essential keys: return, space, left, up, right, down
			if ($.inArray(key, keyArr) === -1) {
				suggestTimeout = setTimeout(getSuggestions, keyDelay);
			}
			// Down key
			if (key === 40) {
				e.preventDefault();
				cycleItems('down');
			// Up key
			} else if (key === 38) {
				e.preventDefault();
				cycleItems('up');
			}
		} else {
			hideSuggestions();
		}
	}).focus(function() {
		clearTimeout(suggestTimeout);
		showSuggestions();
	}).blur(function() {
		clearTimeout(suggestTimeout);
		suggestTimeout = setTimeout(hideSuggestions, blurDelay);
	});

	$('.search form, form.megaSearch').on('submit', function(e) {
		var $listItems = $('#autoSuggest li'),
			$active = $listItems.filter('.hover');

		if ($listItems.length && $active.length) {
			e.preventDefault();
			if ($active.parent('a').length) {
				window.location.href = $active.parent('a').attr('href');
			} else if ($active.children('a').length) {
				window.location.href = $active.children('a').attr('href');
			}
		}
	});
});

jQuery(function($) {

	/* TODO: replace with shimWow when that becomes a thing. */
	var queryString = {};
	window.location.search.replace(
		new RegExp("([^?=&]+)(=([^&]*))?", "g"),
		function($0, $1, $2, $3) {
			queryString[$1] = $3;
		}
	);

	function initRewardsData() {
		window.rewards = {
			accountId: window.dataLayer.loyalty.ACCOUNTID,
			apiEndPoints: {
				pixel: "//loyalty.500friends.com/api/record.gif?"
			},
			// All available badges with names and points.
			badges: {
				'active-subscriber': {
					title: 'Active Subscriber',
					points: 10
				},
				'this-or-that': {
					title: 'This or That',
					points: 10
				},
				'spread-the-word': {
					title: 'Spread The Word',
					points: 10
				},
				'email-enthusiast': {
					title: 'Signup',
					points: 50
				}
			},
			/*
			 * All available actions and their corresponding badge.
			 * Pay attention to the underscore vs hyphen differences between the two.
			 */
			actions: {
				'active_subscribe': {
					badge: 'active-subscriber'
				},
				'this_or_that': {
					badge: 'this-or-that'
				},
				'tweet': {
					badge: 'spread-the-word'
				},
				'email': {
					badge: 'email-enthusiast'
				}
			},
			hasBadge: function(badge) {
				return (window.dataLayer.loyalty && window.dataLayer.loyalty.BADGES && window.dataLayer.loyalty.BADGES.toLowerCase().indexOf(badge.toLowerCase()) !== -1);
			},
			createEventId: function(type, value) {
				return (type + value).replace(/\s+/g, '');
			},
			getBadgeByAction: function(action) {
				var self = this,
					badgeName = self.actions[action].badge,
					badgeObject = self.badges[badgeName],
					badgeTitle = badgeObject.title,
					badgePoints = badgeObject.points;

				return {
					displayName: badgeTitle,
					points: badgePoints,
					badgeName: badgeName
				};
			},
			recordEvent: function(email, type) {
				var params = {
					uuid: this.accountId,
					email: email,
					type: type,
					event_id: this.createEventId(type, email)
				};

				/* using the pixel  */
				$('body').append('<img src="' + this.apiEndPoints.pixel + $.param(params) + '" style="display:none;" />');

				/* update the user info */
				this.reloadUserInfo();
			},
			/* supports order confirmation points */
			recordPoints: function(email, type, points, event_id, userdbid) {
				var params = {
					uuid: this.accountId,
					email: email,
					type: type,
					value: points,
					event_id: this.createEventId(type, event_id)
				};

				/* using the pixel api */
				$('body').append('<img src="' + this.apiEndPoints.pixel + $.param(params) + '" style="display:none;" />');

				$.ajax({
					url: "/api/loyalty/recordPoints/" + userdbid,
					type: 'POST'
				});

				/* update the user info */
				this.reloadUserInfo();
			},
			displayPoints: function(name, amount, badgeName) {
				var pointNotification = '<div id="rewards-points-notification">' +
					'<a href="#" class="rewards-points-close">Close</a>' +
					'<span class="points-earned">Congratulations, you just earned:</span>' +
					'<div id="rewards-points-wrapper" class="clearfix">' +
					'<img src="/sitefiles/image/landing-pages/rewards-program/badge-' + badgeName + '-sm-icon.png" class="rewards-points-badge" />' +
					'<span class="rewards-points-amount">' + amount + 'pts</span> - <span class="rewards-points-name">' + name + '</span>' +
					'</div>' +
					'</div>';

				if ($('#rewards-points-notification').length) {
					$('#rewards-points-notification').remove();
				}

				$('body').append(pointNotification);
				$('#rewards-points-notification .rewards-points-close').on('click', function() {
					$('#rewards-points-notification').animate({
						right: -350
					}, 500, function() {
						$('#rewards-points-notification').remove();
					});
				});
			},
			reloadUserInfo: function() {
				/* update the header */
				$.ajax('/api/loyalty/getuserinfo').done(function(response) {
					if (response.BALANCE) {
						$('#rewards-point-total').text(response.BALANCE);
					}
				});
			},
			/* Simplifies our code below by combining the record and display calls into one */
			recordAndDisplayPoints: function(email, action) {
				var badgeData = this.getBadgeByAction(action);

				this.recordEvent(email, action);
				this.displayPoints(badgeData.displayName, badgeData.points, badgeData.badgeName);
			},
			/* Most of our calls below default to the same first arg.  Convenience method.  */
			recordAndDisplayWithEmail: function(action) {
				return this.recordAndDisplayPoints(window.dataLayer.email, action);
			}
		};
	}

	$('#emailSignup').on('submit', function() {
		$.cookie('mktEmail', $(this).find('input#email').val(), {
			path: "/"
		});
	});

	function loadRewardsGlobal() {
		var currentPage = window.dataLayer.page;

		if (queryString.source && !! queryString.source.match(/eml|trm|treml/gi) && !window.rewards.hasBadge('Active Subscriber')) {
			window.rewards.recordAndDisplayWithEmail('active_subscribe');
			//} else if (currentPage === 'product:compare' && !window.rewards.hasBadge('This or That')) {
		} else if (currentPage === 'product:compare' && !window.rewards.hasBadge('This or That')) {
			window.rewards.recordAndDisplayWithEmail('this_or_that');
		} else if (currentPage === 'product:display' && !window.rewards.hasBadge('Spread The Word')) {
			$('.social-sprite-twitter').one('click', function() {
				window.rewards.recordAndDisplayWithEmail('tweet');
			});
		} else if (currentPage === 'main:tellafriendsent' && !window.rewards.hasBadge('Spread The Word')) {
			window.rewards.recordAndDisplayWithEmail('email');
		} else if (currentPage === 'help:thankyouforsignup' && $.cookie('mktEmail') && !window.rewards.hasBadge('Email Enthusiast')) {
			window.rewards.recordAndDisplayPoints($.cookie('mktEmail'), 'signup');
			$.cookie('mktEmail', null);
		}

		/* resending purchase points from the ecrm */
		$('.rewards-resend-points').on('click', function(event) {
			event.preventDefault();

			var $button = $(this),
				orderNumber = $button.data('order-number'),
				siteName = $button.data('site-name'),
				buttonText = $button.text();

			$.ajax({
				url: "/api/loyalty/recordOrder/" + orderNumber,
				type: 'POST',
				data: {
					"siteName": siteName
				},
				beforeSend: function() {
					$button.text("...");
				}
			}).done(function(data) {
				if (data.success && data.data.hasOwnProperty('points')) {
					var $pointsContainer = $('#rewards-point-total'),
						existingPoints = $pointsContainer.text();
					$pointsContainer.text(parseInt(existingPoints, 10) + parseInt(data.data.points, 10));
					alert(data.data.points + " points sent");
				} else {
					alert("Order points already sent");
				}
				$button.text(buttonText);
			});
		});

		/* resending prior purchase points */
		$('.rewards-resend-prior-points').on('click', function(event) {
			event.preventDefault();

			var $button = $(this),
				siteName = $button.data('site-name'),
				buttonText = $button.text();

			$.ajax({
				url: "/api/loyalty/recordPriorPurchasePoints",
				type: 'POST',
				data: {
					"siteName": siteName
				},
				beforeSend: function() {
					$button.text("...");
				}
			}).done(function(data) {
				if (data.success && data.data.hasOwnProperty('points')) {
					var $pointsContainer = $('#rewards-point-total'),
						existingPoints = $pointsContainer.text();
					$pointsContainer.text(parseInt(existingPoints, 10) + parseInt(data.data.points, 10));
					alert(data.data.points + " points sent");
				} else {
					alert("Prior purchase points already sent");
				}
				$button.text(buttonText);
			});
		});

	}

	// Only run all logic if the page (and site!) warrants it.
	if (document.domain.indexOf('faucet.com') !== 0 && document.domain.indexOf('lightingshowplace.com') !== 0) {
		if (typeof window.dataLayer.customer !== "undefined" && window.dataLayer.customer.isEnrolledInRewards && window.dataLayer.email && window.dataLayer.email.length) {
			// Don't init rewards data until the related info exists.
			if (window.dataLayer == null || window.dataLayer.loyalty == null || window.dataLayer.loyalty.accountId == null || window.dataLayer.page == null) {
				$(window).on('load', function() {
					initRewardsData();
					loadRewardsGlobal();
				});
			} else {
				initRewardsData();
				loadRewardsGlobal();
			}
		}
	}

});