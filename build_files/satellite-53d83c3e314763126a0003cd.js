_satellite.pushBlockingScript(function(event, target, $variables){
  jQuery(function($) {
	$('.profile-footer-category a.view_all').on('click', function() {
		var $this = $(this),
			mainCatText = $this.parents('li.top').children('a').first().text();
		_satellite.setCookie('social-profile-track', 'profile~topNav~' + mainCatText + '~directory');
	});


	$('.profile-footer-category .facebuild_img a').on('click', function() {
		var $this = $(this),
			profileId = $this.data('profile-id'),
			profileName = $this.data('profile-name'),
			tracking = 'profile~topNav~' + profileName + '~' + profileId;

		_satellite.setCookie('social-profile-track', tracking);
	});

});
});
