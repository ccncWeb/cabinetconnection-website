_satellite.pushBlockingScript(function(event, target, $variables){
  var dlIp = window.dataLayer.ip || '',
	dlIsLocalUser = window.dataLayer.isLocalUser || '';
window.s.prop11 = dlIp;
if (_satellite.getQueryParam('source')) {
	if (dlIsLocalUser === 'true') {
		window.s.campaign = "employee_" + _satellite.getQueryParam('source');
	} else {
		window.s.campaign = _satellite.getQueryParam('source');
	}
}

//function to get cookies by name
function getCookieData(name) {
	var pairs = document.cookie.split("; "),
		count = pairs.length,
		parts;
	while (count--) {
		parts = pairs[count].split("=");
		if (parts[0] === name) {
			return parts[1];
		}
	}
	return false;
}
//set eVar58 with cid
window.s.eVar58 = getCookieData("CID");
//set eVar63 with
if (getCookieData("s_vi") !== false) {
	window.s.eVar63 = getCookieData("s_vi").slice(7, -4) + "~" + navigator.userAgent;
}
//function to set user time to pacific for time tracking comaprison against commercial run
function calcTime(offset) {
	$.ajax({
		type: "GET",
		url: "//"+document.domain+"/themes/build/images/beta/nav/build_logo.png",
		complete: function(XMLHttpRequest) {
			var d = XMLHttpRequest.getResponseHeader('Date'),
				nd = new Date(d + (3600000 * offset)),
				nYear = nd.getFullYear(),
				nMonth = nd.getMonth() + 1,
				nDate = nd.getDate(),
				nHours = nd.getHours(),
				nMinutes = nd.getMinutes();
			return nMonth + '/' + nDate + '/' + nYear + ' ' + nHours + ':' + nMinutes;
		}
	});
}
//set eVar49 to time in PST
window.s.eVar49 = calcTime(-8);
});
