_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {
	try {
		function slugify(text){
			return text.replace(/['"]+/g, '').replace(/[ ,\n\s&'"]+/g, '-');
		}	
		$('#header-bar a.logo').attr('data-intcmp', 'header_logo');
		var topLevelLinks = $('#nav > li > a');
		$.each(topLevelLinks, function(index, item){
			var $this = $(item),
					parent = $this.parent(),
					topText = slugify($this.text()),
					topIntcmp = 'mainNav_'+topText+'_'+index;
			$this.attr('data-intcmp', topIntcmp);
			if($(parent).find('ul.featured_cat > li > a').length){
				var subLinks = $(parent).find('ul.featured_cat > li > a');
				$.each(subLinks, function(i, it){
					var $this = $(it),
							$parent = $this.parent(),
							text = slugify($this.text()),
							intcmp = 'mainNav_'+topText+'_featured-cat_'+text+'_'+i;
					$this.attr('data-intcmp', intcmp);
				});
			}
			if($(parent).find('ul.moreCats > li > a')){
				var moreLinks = $(parent).find('ul.moreCats > li > a');
				$.each(moreLinks, function(i, it){
					var $this = $(it),
							$parent = $this.parent(),
							text =slugify($this.text()),
							intcmp = 'mainNav_'+topText+'_more-categories_'+text+'_'+i;
					$this.attr('data-intcmp', intcmp);
				});
			}
		});

		$('#nav a[data-intcmp], #header-bar a[data-intcmp].logo').bind('click', function(e){
			e.preventDefault();
			var s = s_gi(s_account);

			s.linkTrackVars='eVar2';
			s.eVar2 = $(this).attr('data-intcmp');
			s.tl(true, 'o', s.eVar2);
			window.location = this.href;
		});
	} catch (e) {
    	var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: SiteCat: Main Navigation Tracking - dtmTag: mainNavTracking');
    	NREUM.noticeError(dtmErr);
	}
})();	

});
