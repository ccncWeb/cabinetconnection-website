(function() {
	try {
		(function(d, w, s){
		  var js = d.createElement(s);
		  var fjs = d.getElementsByTagName(s)[0];
		  js.async = true;
		  js.src = 'https://fanplayr-assets.s3.amazonaws.com/adaptors/build.com/build.com.js';
		  fjs.parentNode.insertBefore(js, fjs);	
		})(document, window, 'script');
	} catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: FanPlayr - dtmTag: fanplayr');
		NREUM.noticeError(dtmErr);
  }
})();
