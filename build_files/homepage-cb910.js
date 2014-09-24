jQuery(document).ready(function($) {

	var quotes = $("#cyclelist li"),
		quoteIndex = -1;

	function showNextQuote() {
		quoteIndex += 1;
		quotes.eq(quoteIndex % quotes.length)
			.fadeIn(1000)
			.delay(8000)
			.fadeOut(1000, showNextQuote);
	}

	showNextQuote();

	var elm = $('#customer-counter'),
		clr = null,
		date = new Date(),
		currentDate = date.getDate(),
		currentHours = date.getHours(),
		currentSec = date.getSeconds(),
		currentMin = date.getHours(),
		currentMonth = date.getMonth() + 1,
		currentYear = date.getFullYear(),
		closer = Math.floor((currentMonth + "" + currentDate + "" + currentYear) / 2) + 500000 + ((currentHours * 60) + currentMin + (currentSec * 5)),
		$newsletterModal = $('#newsletter-signup'),
		$window = $( window ),
		delay = 5000;


	function inloop() {
		elm.html(closer += 1);
		delay = (Math.floor(Math.random() * (10000 - 500 + 1)) + 500);
		if ((closer % 3) !== 0) {
			return;
		}
		//call 'inloop()' after 30 milliseconds
		clr = setTimeout(inloop, 100);
	}

	function loop() {
		clearTimeout(clr);
		inloop();
		//call 'loop()' after 4 seconds
		setTimeout(loop, delay);
	}

	loop();

	function logEmailModalShown() {
		logToNewRelicInsights('buildStore_newsletterModalShown','true');
	}

	function logEmailModalSubmitted(email) {
		logToNewRelicInsights('buildStore_newsletterModalSubmitted',email);
	}

	$newsletterModal.jqm({
		ajax: $newsletterModal.data('ajax-url'),
		onShow: function(){
			$.cookie('newsletterSignupOffer', true);
		},
		onLoad: function(hash){
			hash.o.prependTo('body');
			hash.w.fadeIn(100);
			logEmailModalShown();
			var emailSignup = $('#emailsub1');
			if (emailSignup) {
				emailSignup.on('submit', function(e) {
					e.preventDefault();
					$.ajax({
						url: '/api/newsletter/signup',
						method: 'get',
						data: {
							email: $('#homepagePopupEmail').val(),
							location: 'modal'
						}
					}).done(function(data){
						if (data.SUCCESS === 'true') {
							logEmailModalSubmitted(data.EMAIL);
						} else {
							logEmailModalSubmitted(false);
						}
						$('#homepage-email-modal').hide();
						$('#email-thanks-modal').show();
					});
				});
			}
		}
	});

	$window.scroll(function() {
		var winScrollTop = $window.scrollTop();
		if (winScrollTop >= 500 && !$.cookie('newsletterSignupOffer')){
			$newsletterModal.jqmShow();
		}
	});

});
