(function() {
	try {
		var lpost = document.createElement('script'); 
			lpost.type = 'text/javascript'; 
			lpost.async = true; 
			lpost.src = '//lpost.exchangesolutions.com/api/js/lpost.js?api=3df9bd8e35e7ba8e20eab54c060fd3efc4ea9a1d'; 
			var s = document.getElementsByTagName('head')[0].appendChild(lpost);  

	} catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: ExchangeSolutions - dtmTag: exchangesolutions');
		NREUM.noticeError(dtmErr);
	}
})();
