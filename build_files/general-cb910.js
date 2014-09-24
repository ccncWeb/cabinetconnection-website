(function(util) {

	util.supportPlaceholder = function() {
		var r;

		function _supportPlaceholder() {
			var i = document.createElement('input');
			r = 'placeholder' in i;
			return r;
		}
		return typeof r === 'undefined' ? _supportPlaceholder() : r;
	};

	//copied from old site, yeah it sucks, but it's used all over.
	util.formatCurrency = function(num) {
		var sign, cents, i;
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num)) {
			num = '0';
		}
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10) {
			cents = '0' + cents;
		}
		for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		}
		return (sign ? '' : '-') + '$' + num + '.' + cents;
	};

	util.isEmail = function(str) {
		return (/^['_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\+[_a-zA-Z0-9-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$/).test(str);
	};

	util.yellowFade = function(el) {
		var b = 155;
		(function f() {
			document.getElementById(el).style.background = 'rgb(255,255,' + (b += 4) + ')';
			if (b < 255) {
				setTimeout(f, 40);
			}
		})();
	};

	util.sideLoadScript = function(scriptSrc, callback) {
		if (document.querySelectorAll('script[src="' + scriptSrc + '"]').length === 0) {
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = scriptSrc;
			if (callback && typeof callback === 'function') {
				newScript.async = true;
				newScript.onload = function() {
					callback(newScript);
				};
			}
			document.head.appendChild(newScript);
		}
	};

	util.querystring = {
		//Extends a location or querystring with the passed in object and returns a querystring.
		extend: function(loc, o) {
			return this.create($.extend(this.parse(loc), o));
		},
		//This collapses querystring to an object. Any duped keys gets turned into an array.
		//loc is optional, defaults to window.location. Can be either a location object or a querystring
		parse: function(loc) {
			loc = typeof loc !== 'undefined' ? loc : location;
			var q = '',
				m, o = {},
				i, len, kv, k, v, pairs;
			if (typeof loc === 'string') {
				m = loc.match(/(?:\?)(.*)/);
				q = m ? m[1] : loc;
			} else {
				q = loc.search.slice(1);
			}
			pairs = q.split('&');
			for (i = 0, len = pairs.length; i < len; i++) {
				if (!pairs[i].length) {
					continue;
				}
				kv = pairs[i].split('=');
				k = kv[0];
				//fix pluses => spaces
				v = kv[1].replace(/\+/g, ' ');
				if ($.isArray(o[k])) {
					o[k].push(v);
				} else if (typeof o[k] !== 'undefined') {
					o[k] = [o[k], v];
				} else {
					o[k] = v;
				}
			}
			return o;
		},
		//returns value of a key in a location or querystring
		getItem: function(k, loc) {
			return this.parse(loc)[k];
		},
		//changes a value in a location or querystring and returns it
		setItem: function(k, v, loc) {
			var o = this.parse(loc);
			o[k] = v;
			return this.create(o);
		},
		//Turns object into valid queryString. Turns arrays into duped key/value pairs
		// Ryan Decoded then Encoded... Slap me if this breaks :-*
		create: function(o, ignoreQMark, separator) {
			var pairs = [],
				i, len;
			$.each(o, function(k, v) {
				if ($.isArray(v)) {
					for (i = 0, len = v.length; i < len; i++) {
						pairs.push(k + '=' + encodeURIComponent(decodeURIComponent(v[i])));
					}
				} else {
					pairs.push(k + '=' + encodeURIComponent(decodeURIComponent(v)));
				}
			});
			return (ignoreQMark ? '' : '?') + pairs.join((separator) ? separator : '&');
		}
	};

}(window.util = window.util || {}));

function logToNewRelicInsights(name, value) {
	$.ajax({
		url: '/api/insight/set',
		method: 'post',
		data: {
			name: name,
			value: value
		}
	});
}

(function() {
	/* return string containing value of specified cookie or '' */
	window.readCookie = function(name) {
		var dc = document.cookie,
			prefix = name + '=',
			begin = dc.indexOf('; ' + prefix),
			end;
		if (begin === -1) {
			begin = dc.indexOf(prefix);
			if (begin) {
				return '';
			}
		} else {
			begin += 2;
		}
		end = document.cookie.indexOf(';', begin);
		if (end === -1) {
			end = dc.length;
		}
		return unescape(dc.substring(begin + prefix.length, end));
	};
})();

(function($) {
	/**
	 * jQuery.preload
	 *
	 * Preload images using the promise pattern.
	 *
	 * Usage:
	 *
	 *     $.preload(img_uri, img_uri, ...).done(function(img, img, ...) {
	 *       // Do stuff with the arguments
	 *     });
	 *
	 * Since $.preload returns a jQuery.Deferred[1] promise, you can attach
	 * callbacks the same way you'll attach them to an AJAX request
	 *
	 * If you preload multiple images the script will wait until all of them are
	 * loaded usign $.when.
	 *
	 * [1]: http://api.jquery.com/category/deferred-object/
	 *
	 * @return {jQuery.Deferred.promise}
	 */
	$.preload = function() {
		var images = arguments.length > 1 ? arguments : arguments[0];

		// Use $.when to recursively preload multiple images
		if ($.isArray(images)) {
			return $.when.apply(window, $.map(images, function(image) {
				return $.preload(image);
			}));
		}

		// Single image
		var def = $.Deferred();
		var img = new Image();

		img.onload = function() {
			def.resolve(img);
		};

		img.onerror = function() {
			def.reject(img);
		};

		img.src = images;
		return def.promise();
	};

	//on document ready
	$(function() {

		// lazy load of sub navigaition items
		$.ajax({
			url: '/api/navigation/subnavs',
			type: 'get',
			dataType: 'json',
			success: function(subNavs) {
				$('#nav > .top').find('.mega').map(function() {
					var id = $(this).data('id');
					var data = _.findWhere(subNavs, {
						id: id
					});
					if (data) {
						$(this).data('loaded', 'true');
						$(this).html(tplSubNav(data));
					}
				});
			}
		});

		if ($('#freeshipping').length) {
			$('#freeshipping').jqm({
				toTop: true
				// inits shipping modal box for jqModal
			});
			$('.freeshipping span').on('click', function() {
				$('#freeshipping').jqmShow();
			});
		}


		function triggerOmniture(action, redirectLocation) {
			if (typeof window.s !== 'undefined') {
				var s = window.s_gi(window.s_account),
					location;
				if (window.location.pathname.indexOf('index.cfm') !== -1) {
					location = window.dataLayer.page;
				} else {
					location = window.dataLayer.page.replace(/:.*/, ':') + window.location.pathname.replace(/\/[^\/]+\//, '');
				}
				s.linkTrackVars = 'eVar46,prop15,events';
				s.linkTrackEvents = 'event30';
				s.events = 'event30';

				if (action === 'modal close') {
					s.eVar46 = 'header:close modal:' + location;
				} else if (action === 'modal sign in') {
					s.eVar46 = 'header:login click:' + location;
				} else if (action === 'modal create account') {
					s.eVar46 = 'header:sign up click:' + location;
				} else if (action === 'open modal') {
					s.eVar46 = 'header:open modal:' + location;
				} else if (action === 'view list') {
					s.eVar46 = 'header:view list:' + location;
				} else {
					return false;
				}
				s.prop15 = s.eVar46;
				s.tl(this, 'o', 'Favorites Internal', null, function() {
					if (redirectLocation) {
						window.location = redirectLocation;
					}
				});

			}

		}

		$('#heart-box-link').on('click', function() {

			if (window.dataLayer.isLoggedIn === 'false' && $('#heart-box-modal').length) {
				var $favorites = $('#heart-box-modal');

				$favorites.jqm({
					toTop: true,
					modal: true,
					ajax: '/api/info_modals/favorite',
					onHide: function(hash) {
						hash.w.fadeOut('2000', function() {
							hash.o.remove();
						});
						window.BCOM.Utils.Omniture.pubSub.trigger('favorites', {
							action: 'header',
							status: 'close modal'
						});

					},
					onShow: function(hash) {
						hash.o.prependTo('body');
						hash.w.css('opacity', 0.88).fadeIn();

						hash.w.on('click', '.modal-login-button', function(e) {
							e.preventDefault();
							window.BCOM.Utils.Omniture.pubSub.trigger('favorites', {
								action: 'header',
								status: 'login click',
								redirect: $(e.target).parent().attr('href')
							});
						});
						hash.w.on('click', '.modal-create-account-button', function(e) {
							e.preventDefault();
							window.BCOM.Utils.Omniture.pubSub.trigger('favorites', {
								action: 'header',
								status: 'sign up click',
								redirect: $(e.target).parent().attr('href')
							});
						});
					}
				});

				$favorites.jqmShow();

				window.BCOM.Utils.Omniture.pubSub.trigger('favorites', {
					action: 'header',
					status: 'open modal'
				});
			} else {
				window.BCOM.Utils.Omniture.pubSub.trigger('favorites', {
					action: 'header',
					status: 'view list',
					redirect: "/favorites/myfavorites"
				});
			}
		});

		if ($('#email-modal').length) {
			var $favorite_email = $('#email-modal');

			$('#email-list').on('click', function(e) {
				e.preventDefault();

				$favorite_email.jqm({
					toTop: true,
					modal: true,
					ajax: '/api/info_modals/favoriteEmail'
				});

				$favorite_email.jqmShow();
			});

		}

		$(document).keydown(function(event) {
			if (event.which === 27 && $('.jqmWindow').length) {
				$('.jqmWindow').jqmHide();
			}
		});

		$.fn.smartBackgroundImage = function(url, callback) {
			var t = this;
			//create an img so the browser will download the image:
			$('<img />').attr('src', url).on('load', function() {
				t.each(function() {
					$('<div />')
						.addClass('bgImage')
						.hide()
						.css('background-image', 'url(' + url + ')')
						.appendTo(this)
						.fadeIn(200, callback);
				});
			});
			return this;
		};

		$.fn.loadSuperSplash = function() {
			$(this).find('.super-splash').last().each(function() {
				var $t = $(this),
					img = $t.data('image'),
					linkclass = $t.data('linkcolor'),
					phoneclass = $t.data('phonecolor'),
					height = $t.data('splashheight');

				$('body').smartBackgroundImage(img, function() {

					var $hl = $('#header .header-links'),
						$ph = $hl.find('.phone-number');

					$hl.removeClass($hl.data('prevClass') || 'dark')
						.addClass(linkclass)
						.data('prevClass', linkclass);
					$ph.removeClass($ph.data('prevClass') || 'dark')
						.addClass(phoneclass)
						.data('prevClass', phoneclass);
				});

				if (height !== null) {
					$('#header-splash')
						.height(height ? height : 'auto')
						.html($t.html());
				}

			});
		};

		// If were on an IE10 Browser, lets add the ie10 class to the body.
		if (window.browserDetect.client === 'Explorer' && window.browserDetect.version === 10) {
			$('body').addClass('ie10');
		}

		$('body').loadSuperSplash();

		$('.button .disabled').on('click', function(e) {
			e.preventDefault();
		});

		$('.selectable-item').on('click', function() {
			$(this).closest('.selectable-item').addClass('selected')
				.end().closest('.input').siblings('.quantity').toggle('slide');
		});

		// Scroll back to top
		$('#back-top').hide();
		$(window).scroll(function() {
			if ($(this).scrollTop() > 600) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-top a').on('click', function() {
			$('body,html').animate({
				scrollTop: 0
			}, 800);

			return false;
		});

		$('body').on('click', '.button .disabled', function(e) {
			e.preventDefault();
		});

		$('body').on('mouseover', '.optip_top', function() {
			var $t = $(this);
			if (!$t.data('init')) {
				$t.data('init', true);
				$t.optip({
					'position': 'topcenter'
				});
				$t.trigger('mouseover');
			}
		});

		$('body').on('mouseover', '.optip', function() {
			var $t = $(this);
			if (!$t.data('init')) {
				$t.data('init', true);
				$t.optip({
					'position': 'topright',
					'offset': {
						'top': 0,
						'left': 12
					}
				});
				$t.trigger('mouseover');
			}
		});


		if (!('ontouchstart' in document.documentElement)) {
			//Desktop nav functionality
			if ($.fn.hoverIntent) {
				$('#nav').hoverIntent({
					over: function() {
						$(this).addClass('active');
					},
					out: function() {
						$(this).removeClass('active');
					},
					timeout: 500
				});

				$('#nav .top').hoverIntent(function() {
					if ($(this).find('.mega').data('loaded')) {
						$(this).closest('.top').addClass('current');
					}
				}, function() {
					$(this).closest('.top').removeClass('current');
				});
			}
		} else {

			var $nav = $('#tablet-nav'),
				$navBack = $('#nav-back'),
				$navHeading = $('#nav-heading');

			$nav.on('click', '.top > a', function(e) {
				e.preventDefault();
				var current = 'current',
					$category = $(e.currentTarget).closest('.js-top'),
					$categories = $nav.find('.js-top');

				// reset all current classes
				if (!$category.hasClass(current)) {
					$categories.removeClass(current);
				}
				$category.toggleClass(current);
			});

			$nav.on('click', '#level-1 a', function(e) {
				e.preventDefault();
				e.stopPropagation();
				var $el = $(this),
					$li = $el.closest('li'),
					active = 'active';
				// wipe all active classes
				$('.js-level-2').removeClass(active);
				$navBack.removeClass('hide');
				$navHeading.text($el.text());
				// add classes back in
				$('#level-1').addClass(active);
				$('.js-level-2').eq($li.index()).addClass(active);
			});

			$navBack.on('click', function(e) {
				e.stopPropagation();
				$('#level-1, .js-level-2').removeClass('active');
				$navBack.addClass('hide');
				$navHeading.text('All Categories');
			});

			$nav.on('click', '.js-close', function(e) {
				e.stopPropagation();
				$(this).closest('.js-top').removeClass('current');
			});
		}

		/* Sticky Header */
		var $sticky = $('.sticky');

		if ($sticky.length) {
			var top = $sticky.offset().top - parseFloat($sticky.css('margin-top').replace(/auto/, 0)),
				$stickyLeft = $('#left.sticky-left'),
				fixedHeight = $('#left').height() + ($(window).height() * 0.35),
				facetsToShow = 25,
				$facetContents = $('.facet-contents'),
				$facetHeader = $('.facet-header'),
				$facetWidgetsAndContent = $('#left > .content-group');

			$(window).scroll(function(event) {
				// what the y position of the scroll is
				var yPosition = $(this).scrollTop();
				// whether that's below the form
				if (yPosition >= top) {
					// if so, add the fixed class
					if (!$sticky.hasClass('fixed')) {
						$sticky.hide().addClass('fixed').fadeIn();
					}
				} else {
					// otherwise remove it
					if ($sticky.hasClass('fixed')) {
						$sticky.removeClass('fixed');
					}
				}
			});
		}

		// Load Smart Columns
		if ($.fn.smartColumns) {
			$('.smallcolumn').smartColumns(150);
			$('.mediumcolumn').smartColumns(200);
			//$('.manufcolumn').smartColumns(100);
			$('#recentProdList').smartColumns(220);


			$('.autoColumns').each(function() {
				var $t = $(this);

				$t.smartColumns({
					minWidth: $t.data('minwidth'),
					normalizeHeight: $t.data('normalizeheight'),
					expandColumns: !!$t.data('expandcolumns'),
					maxColumns: $t.data('maxcolumns') || 0
				});
			});
		}

		if ($.fn.popupWindow) {
			$('.popupWindow').popupWindow();
		}

		var $splash = $('#splash');

		if ($splash.length) {
			//Dynamicly loading widget
			$.getScript('/themes/build/scripts/vendor/jquery/jquery.cycle.js?_1', function() {
				var pause = !$.stdlib.isIE7() && !$.stdlib.isIE6();
				$splash.before('<div id="controls" />').cycle({
					speed: 'slow',
					timeout: 6000,
					pager: '#controls',
					pagerAnchorBuilder: function(idx, slide) {
						return '<a href="#"></a>';
					},
					containerResize: 0,
					slideResize: 0,
					sync: 0,
					fit: 1,
					pause: pause,
					pauseOnPagerHover: pause,
					before: function(curr, next, opt, fwdFlag) {
						$(curr).removeClass('activeSlide');
						$(next).addClass('activeSlide');
					}
				});
			});
		}

		var $mainMenu = $('#main-button #main-menu');
		if ($mainMenu.length) {
			function addMega() {
				$mainMenu.addClass('on');
			}

			function removeMega() {
				$mainMenu.removeClass('on');
			}

			if ($.fn.hoverIntent) {
				$('#main-button').hoverIntent({
					interval: 200,
					sensitivity: 7,
					over: addMega,
					timeout: 500,

					out: removeMega
				}).click(addMega);
			}
		}
		if ($.stdlib.isIE6()) {
			$('#main-menu li').hoverClass();
		}

		if ($.fn.datepicker) {
			$('.datepicker').each(function() {
				var $this = $(this),
					settings = $.extend({}, $this.data('datepickersettings'));
				$this.datepicker(settings);
			});
		}

		//There will only be one questionbox on a page.
		$('#questionbox').on('focus', function() {
			$('#askmore').show();
		});


		$('#emailSignup').submit(function(e) {
			//should use validation.
			var $field = $('#email');
			if (!util.isEmail($field.val())) {
				alert('Please enter a valid e-mail address!');
				$field.focus();
				e.preventDefault();
			}
		});

		if ($.fn.validate) {
			$('form.validate').validate();
		}

		$('.manufCat').each(function(idx, mf) {
			var $mf = $(mf);
			$mf.find('a[title]').removeAttr('title');
			$mf.optip({
				position: 'autoleftright'
			});
		});

		//Trust-guard events
		$('#trustlink').click(function() {
			var nonwin = navigator.appName !== 'Microsoft Internet Explorer' ? 'yes' : 'no';
			window.open(this.href, 'welcome', 'location=' + nonwin + ',scrollbars=yes,width=517,height=' + screen.availHeight + ',menubar=no,toolbar=no');
			return false;
		}).each(function() {
			var src = (document.location.protocol === 'http:') ? 'http://seals.trust-guard.com/' : 'https://secure.trust-guard.com/secureseals/';
			var $img = $(this).children().eq(0);
			$img.attr('src', src + $img.data('src'));
			this.oncontextmenu = function(e) {
				e.preventDefault();
				alert('Copying Prohibited by Law - This image and all included logos are copyrighted by trust-guard \u00A9 ' + (new Date()).getFullYear() + '.');
			};
		});
	});

	//http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

})(jQuery);


/* Popup Video Player Start */
// HOISTING!  Gotta make these available to Omniture - can't see them otherwise.
// Misspelled - not about to search to see what all this might impact, but looks to be for Omniture
var videotTitle = '';
var playCount = 0;
var playerName = '';
var videoContainer = {};
var wistiaPlayer = '';
var ytplayer = '';

jQuery(function($) {
	if ($('.overview-video').length || $('.video-link').length) {
		// Completely destroy the modal and overlay to reduce potential problems
		function destroyModal() {
			var time = 0;
			try {
				if (providerID === '1') {
					time = parseInt(wistiaPlayer.time(), 10);
					wistiaPlayer.pause();
					wistiaPlayer.unbind();
				} else if (providerID === '2') {
					time = parseInt(ytplayer.getCurrentTime(), 10);
					ytplayer.stopVideo();
				}
				// Run this deferred so s.Media call doesn't cause modal to hang
				_.defer(function() {
					if (s.Media) {
						s.Media.stop(videotTitle, time);
						s.Media.close(videotTitle);
					}
				});
				// Closing modal before video load throws an error on YouTube - this allows that to not cause problems
			} catch (e) {
				time = 0;
			}
			$('.video-modal').remove();
			$('.jqmOverlay').remove();
		}

		function makeVideoModal(videoID, desc, title, providerID, urlID) {
			/*
			/ Make a video modal for fun and profit - uses jQmodal
			/ This sets up a document fragment and then uses raw DOM manipulation against that
			/ Also supports both old and new markup.
			*/
			var videoFragment = document.createDocumentFragment();
			var videoContainer = document.createElement('div');
			videoContainer.setAttribute('id', 'video-' + videoID + '-modal');
			$(videoContainer).addClass('video-modal jqmWindow');
			var videoDesc = document.createElement('h3');
			videoDesc.appendChild(document.createTextNode(desc));
			videoDesc.setAttribute('id', 'video-desc');
			var videoTitleHolder = document.createElement('div');
			videoTitleHolder.setAttribute('id', 'video-title-holder');
			var videoTitle = document.createElement('span');
			videoTitle.setAttribute('id', 'video-title');
			videoTitle.appendChild(document.createTextNode(title));
			videoTitleHolder.appendChild(videoTitle);
			var videoHolder = document.createElement('div');
			videoHolder.setAttribute('id', 'video-goes-here');
			var modalClose = document.createElement('span');
			modalClose.className = 'jqmClose';
			modalClose.appendChild(document.createTextNode('\u00D7'));
			videoContainer.appendChild(modalClose);
			videoContainer.appendChild(videoHolder);
			videoContainer.appendChild(videoTitleHolder);
			videoContainer.appendChild(videoDesc);
			/*
			/ This is the rendered markup from the above
			/
			<div id="video-{videoID}-modal" class="video-modal jqmWindow">
				<span class="jqmClose">×</span>
				<div id="video-goes-here"></div>
				<div id="video-title-holder">
					<span id="video-title"></span>
				</div>
				<h3 id="video-desc"></h3>
			</div>
			*/

			// Remember - misspelled
			videotTitle = $(videoTitle).text();

			// ...and insert the whole mess when we're done.
			videoFragment.appendChild(videoContainer);
			$('body').append(videoFragment);

			// jqModal init and trigger to show.
			videoModal = '';
			$('.video-modal').jqm({
				onHide: destroyModal,
				toTop: true
			});
			$('.video-modal').jqmShow();

			playerId = 'newVideoPlayer_' + new Date().getTime();

			// There are two "providers", Youtube (2) and Wistia (1)
			if (providerID === 2) {
				playerName = 'YouTube';
				var params = {
					allowScriptAccess: 'always'
				};
				var atts = {
					id: playerId
				};
				var videoEmbedURL = 'http://www.youtube.com/v/' + urlID + '?enablejsapi=1&playerapiid=' + playerId + '&version=3';
				var embedCallback = function() {
					setTimeout(function() {
						$(window).resize();
					}, 500);
				};
				swfobject.embedSWF(videoEmbedURL, 'video-goes-here', '715', '392', '8', null, null, params, atts, embedCallback);
			} else if (providerID === 1) {
				playerName = 'Wistia';
				wistiaPlayer = Wistia.embed(urlID, {
					autoPlay: true,
					videoWidth: 715,
					videoHeight: 400,
					//platformPreference: 'html5',
					container: 'video-goes-here'
				});

				wistiaPlayer.bind('play', function() {
					playCount++;
					var time = parseInt(wistiaPlayer.time(), 10);

					// Execute Omniture open call on first play event to begin video tracking
					if (playCount === 1) {
						var duration = parseInt(wistiaPlayer.duration(), 10);
						time = 0;
						s.Media.open(videotTitle, duration, 'Wistia');
					}
					s.Media.play(videotTitle, time);
				});

				wistiaPlayer.bind('pause', function() {
					time = parseInt(wistiaPlayer.time(), 10);
					s.Media.stop(videotTitle, time);
				});

				wistiaPlayer.bind('end', function() {
					time = parseInt(wistiaPlayer.time(), 10);
					s.Media.stop(videotTitle, time);
					s.Media.close(videotTitle);
				});
			}
		}

		var videoScripts = [];

		videoScripts.push($.getScript('//fast.wistia.com/static/E-v1.js'));
		videoScripts.push($.getScript('/assets/scripts/vendor/plugins/swfobject-2.2.min.js'));

		// Event watching and dispatchers here.

		$.when(videoScripts).then(function() {
			// New markup support
			$('body').on('click', '.video-list li', function() {
				currLink = $(this);
				playCount = 0;
				videoID = currLink.prop('id');
				desc = currLink.data('description');
				title = currLink.data('title');
				providerID = currLink.data('videoproviderid');
				urlID = currLink.data('videourlid');
				makeVideoModal(videoID, desc, title, providerID, urlID);
			});
			// Old markup support
			$('body').on('click', '.video-link', function() {
				currLink = $(this);
				playCount = 0;
				videoID = currLink.prop('href').replace('#open-', '');
				desc = currLink.data('description');
				title = currLink.prop('title');
				providerID = currLink.data('videoproviderid');
				urlID = currLink.data('videourlid');
				makeVideoModal(videoID, desc, title, providerID, urlID);
			});

			s.loadModule('Media');
			s.Media.trackVars = 'events,eVar47,eVar48,eVar51,prop10';
			s.Media.trackEvents = 'event63,event64,event65,event66';
			s.Media.autoTrack = false;
			s.Media.playerName = playerName;
			s.Media.trackMilestones = '25,50,75,98';
			s.Media.segmentByMilestones = true;
			s.Media.trackWhilePlaying = true;
			s.Media.trackUsingContextData = true;
			s.Media.contextDataMapping = {
				'a.media.name': 'eVar47,prop10',
				'a.media.segment': 'eVar48',
				'a.contentType': 'eVar51',
				'a.media.timePlayed': 'event63',
				'a.media.view': 'event64',
				'a.media.segmentView': 'event66',
				'a.media.complete': 'event65'
			};
			s.Media.monitor = function(s, media) {
				if (media.event === 'OPEN' || media.event === 'PLAY' || media.event === 'STOP' || (media.event === 'CLOSE' && media.eventFirstTime)) {
					s.Media.track(media.name);
				}
			};
		});

		window.onYouTubePlayerReady = function(pId) {
			ytplayer = document.getElementById(pId);
			ytplayer.addEventListener('onStateChange', 'onYouTubePlayerStateChange');
			if (ytplayer.getAttribute('autoplay') !== '0') {
				ytplayer.playVideo();
			}
		};

		window.onYouTubePlayerStateChange = function(event) {
			/* Event definitions
			 * unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5)
			 */

			var time = parseInt(ytplayer.getCurrentTime(), 10);
			switch (event) {
				case 0:
					s.Media.stop(videotTitle, time);
					s.Media.close(videotTitle);
					break;

				case 1:
					playCount++;

					// Execute Omniture open call on first play event to begin video tracking
					if (playCount === 1) {
						var duration = parseInt(ytplayer.getDuration(), 10);
						time = 0;
						s.Media.open(videotTitle, duration, 'YouTube');
					}

					s.Media.play(videotTitle, time);
					break;

				case 2:
				case 3:
					s.Media.stop(videotTitle, time);
					break;
			}
		};
	}

	// Only initalize favorites after page has loaded to ensure window.dataLayer exists
	$(document).on('ready ajaxComplete', function() {
		if (window.dataLayer && $('.favoriteable').length) {
			$('.favoriteable').favorites();
		}
	});

	if ($.fn.compare) {
		$('#compare_tool').compare({
			cookieName: 'PRDUNIQUEID',
			type: 'compare',
			actionBtn: $('#compare_btn'),
			actionText: 'Compare',
			actionAltText: 'Compare',
			buttonDisabledClass: 'disabled-button',
			params: window.compareToolParameters || {},
			productMinimum: 2
		});
		// Init finish sample widget
		$('#finish-sample-tool').compare({
			cookieName: 'FSUID',
			type: 'finish-sample',
			actionBtn: $('#finish-sample-btn'),
			actionText: 'Order Samples',
			actionAltText: 'Limit 5 Samples per Customer',
			buttonDisabledClass: 'disabled-button',
			params: window.finishSampleToolParameters || {},
			productLimit: 5
		});
	}

	$('.internal-nav').on('click', 'a', function(e) {
		if ($(this).text().toLowerCase().indexOf('swatch') > -1) {
			var iframeSource = $(this);
			e.preventDefault();
			var swatchFragment = document.createDocumentFragment();
			var swatchContainer = document.createElement('div');
			$(swatchContainer).addClass('swatch-modal jqmWindow');
			var modalClose = document.createElement('span');
			modalClose.className = 'jqmClose';
			modalClose.appendChild(document.createTextNode('\u00D7'));
			var swatchIframe = document.createElement('iframe');
			$(swatchIframe).attr('src', iframeSource.attr('href'));
			swatchContainer.appendChild(modalClose);
			swatchContainer.appendChild(swatchIframe);
			swatchFragment.appendChild(swatchContainer);
			$('body').append(swatchFragment);
			$('.swatch-modal').jqm({
				onHide: destroyModal,
				toTop: true
			});
			$('.swatch-modal').jqmShow();
		}
	});

	// CLose modal on esc key press

	$(document).keydown(function(e) {
		if (e.which === 27) {
			$('.jqmWindow').jqmHide();
		}
	});

});

jQuery(function($) {
	// Completely destroy the modal and overlay to reduce potential problems
	function destroyModal() {
		$('.swatch-modal').remove();
		$('.jqmOverlay').remove();
	}

	$('.internal-nav').on('click', 'a', function(e) {
		if ($(this).text().toLowerCase().indexOf('swatch') > -1) {
			var iframeSource = $(this);
			e.preventDefault();
			var swatchFragment = document.createDocumentFragment();
			var swatchContainer = document.createElement('div');
			$(swatchContainer).addClass('swatch-modal jqmWindow');
			var modalClose = document.createElement('span');
			modalClose.className = 'jqmClose';
			modalClose.appendChild(document.createTextNode('\u00D7'));
			var swatchIframe = document.createElement('iframe');
			$(swatchIframe).attr('src', iframeSource.attr('href'));
			swatchContainer.appendChild(modalClose);
			swatchContainer.appendChild(swatchIframe);
			swatchFragment.appendChild(swatchContainer);
			$('body').append(swatchFragment);
			$('.swatch-modal').jqm({
				onHide: destroyModal,
				toTop: true
			});
			$('.swatch-modal').jqmShow();
		}
	});
});

jQuery.log = function() {
	if (window.console && window.console.log) {
		window.console.log(arguments.length === 1 ? arguments[0] : arguments);
	}
};

// Patches over IE8's lack of support for Array.indexOf
if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0); i < this.length; i++) {
			if (this[i] === obj) {
				return i;
			}
		}
		return -1;
	};
}

// TODO: move to template home
// sub navigation template
var tplSubNav = function(obj) {
	var __p = '';
	var print = function() {
		__p += Array.prototype.join.call(arguments, '');
	};
	with(obj || {}) {
		__p += '<li class="sub_wrap"><div class="sub_nav_content"><div class="subnav_dropdown"><ul class="featured_cat clearfix">';
		_.each(featured, function(category) {
			__p += '<li><a href="' +
				(category.link) +
				'"><img border="0" width="140" height="140" title="' +
				(category.title) +
				'" alt="' +
				(category.title) +
				'" src="' +
				(category.imageSrc) +
				'">' +
				(category.title) +
				'</a></li>';
		});
		__p += '</ul><div><ul><li><div class="dropdown_footer modulebox" style="width: 610px;"><p class="dropdown_footer_heading">More ' +
			(title) +
			'</p><ul class="moreCats">';
		_.each(more, function(category) {
			__p += '<li><a href="' +
				(category.link) +
				'">' +
				(category.title) +
				'</a></li>';
		});
		__p += '</ul><a class="view_all" href="' +
			(link) +
			'">Shop All ' +
			(title) +
			'</a></div></li><li data-category="' +
			(id) +
			'" class="profile-header-category"><div data-category="' +
			(id) +
			'" class="profile-footer-category" style=""><div class="dropdown_footer modulebox"><p class="dropdown_footer_heading">What can we help you with?</p><ul><li class="facebuild_text">Let one of our experts help guide you through your project with expert advice ranging from inspiration to installation.</li><li></li></ul><div class="facebuild_img"><div class="name_wrap"><span class="name">' +
			(profile.name) +
			'</span></div><a href="' + (profile.link) + '"><img src="' +
			(profile.imageSrc) +
			'" width="112" height="140"></a></div><a class="view_all" href="/profile/directory">View Expert Profiles</a></div></div></li></ul></div></div></div></li>';
	}
	return __p;
};