_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {
	try {
  	//set vars 
    var _mfq = _mfq || [],
        mf = document.createElement("script"); 
        mf.type = "text/javascript"; 
        mf.async = true; 
        mf.src = "//cdn.mouseflow.com/projects/e85898e8-474a-4c65-8739-495844e6e81a.js"; 
    //append mousefloejs to the document head
    document.getElementsByTagName("head")[0].appendChild(mf);
	} catch (e) {
    	var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Mouse Flow Test - dtmTag: mouseFlow');
    	NREUM.noticeError(dtmErr);
	}
})();	
});
