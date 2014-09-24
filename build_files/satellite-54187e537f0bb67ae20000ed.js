_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {
	try {
		var triggermail = triggermail || [],
		  	dlCustomerEmail = window.dataLayer.email || "",
       		dlEmailSignup = window.dataLayer.emailSignup || "false";
        

		triggermail.load = function(site){
        	var triggerMailScript = document.createElement("script");
        		triggerMailScript.type = "text/javascript";
        		triggerMailScript.async= true;
        		triggerMailScript.src = ("//triggeredmail.appspot.com/triggermail.js/"+site+".js");
        		document.getElementsByTagName("head")[0].appendChild(triggerMailScript);
      	};
   		
    	triggermail.load("build");

    	window.triggermail = triggermail;

		if(dlEmailSignup === "true"){
			window.triggermail_email_address = dlCustomerEmail;
		}
	} catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: TriggerMail - dtmTag: TriggerMail');
		NREUM.noticeError(dtmErr);
	}
})();
});
