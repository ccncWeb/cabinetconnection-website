_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {
	try {
		var siteData = {
				'build.com': ['7145648780', '7145648780'],
				'faucetdirect.com': ['5018175981', '6946525583'],
				'lightingdirect.com': ['9448375588', '9899991986'],
				'pullsdirect.com': ['3541442783', '5330191587'],
				'ventingdirect.com': ['8471169988', '6806924782'],
				'handlesets.com': ['5157776787', '3853458381'],
				'ventingpipe.com': ['5668915583', '9760391187']
			},
			domainArray = document.domain.split('.'),
			store = domainArray[domainArray.length - 2] + '.' + domainArray[domainArray.length - 1],
			dlPage = window.dataLayer.page || '',
			dlCurrentPageResults = window.dataLayer.currentPageResults || 0,
			adSenseStyleUpdate = 'display:inline-block; border:3px solid #e1e1e1; padding: 5px; color: #999; max-width: 750px;',
			adSenseSize = '',
			adSenseTarget = '',
			adSenseTargetOption = '',
			adUnit = 0,
			injectAdSense = false,
			adSenseIns, adsbygoogle;

		var adSenseConfig = function adSenseConfig(targetTag, targetTagOption, adUnitIndex, adtype, adAlignment, marginUpdate) {
			adUnit = adUnitIndex - 1;
			adSenseTargetOption = targetTagOption === 'before' ? '' : targetTagOption;
			if (typeof adAlignment !== 'undefined') {
				adSenseStyleUpdate += 'text-align:' + adAlignment + ';';
			}
			if (typeof marginUpdate !== 'undefined') {
				adSenseStyleUpdate += 'margin:' + marginUpdate + ';';
			}
			if (adtype === 'poster') {
				adSenseSize = 'width:300px;height:600px';
			} else {
				//default banner size
				adSenseSize = 'width:728px;height:90px';
			}
			
			adSenseTarget = document.querySelector(targetTag) || 'undefined';
			
			//make sure the target exists on page before attmepting to inject.
			if (adSenseTarget !== 'undefined') {
				injectAdSense = true;
			}
		};

		//set the inhection location for each them and template
		if (store === 'build.com') {
			if (dlPage === 'product:display') {
				adSenseConfig('#main-container', 'nextSibling', 1, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'main:404') {
				adSenseConfig('#notFoundContent', 'nextSibling', 1, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'search:browse' && dlCurrentPageResults === 0) {
				adSenseConfig('#featuredBrands', 'previousElementSibling', 1, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'search:browse' && dlCurrentPageResults > 0) {
				adSenseConfig('.bsc', 'before', 2, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'browse:category') {
				adSenseConfig('.bsc', 'before', 2, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'checkout:ordercomplete') {
				adSenseConfig('#emailReceipt', 'nextSibling', 1, 'banner', 'center', '20px 110px');
			}
		} else {
			if (dlPage === 'product:display') {
				adSenseConfig('#techspecs', 'nextSibling', 1, 'poster', 'center', '0 20px');
			} else if (dlPage === 'checkout:ordercomplete') {
				adSenseConfig('#emailReceipt', 'nextSibling', 1, 'banner', 'center', '20px 110px');
			} else if (dlPage === 'search:browse' && dlCurrentPageResults > 0) {
				adSenseConfig('#serpContainer', 'nextSibling', 2, 'banner', 'center', '0 auto 20px');
			} else if (dlPage === 'browse:category') {
				adSenseConfig('#interiorValueAds', 'nextSibling', 2, 'banner', 'center', '0 auto');
			}
		}
		if (injectAdSense) {
			jQuery.getScript('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')
				.done(function(){

				adSenseIns = document.createElement("div");
				if (adSenseStyleUpdate !== '') {
					adSenseIns.setAttribute('style', adSenseStyleUpdate);
				}
				adSenseIns.innerHTML = '<div style="text-align:left;">Sponsored Links</div><br /><ins class="adsbygoogle" style="display:inline-block; ' + adSenseSize + '" data-ad-client="ca-pub-0608898513106844" data-ad-slot="' + siteData[store][adUnit] + '"></ins>';
				if (adSenseTargetOption !== '') {
					adSenseTarget.parentNode.insertBefore(adSenseIns, adSenseTarget[adSenseTargetOption]);
				} else {
					adSenseTarget.parentNode.insertBefore(adSenseIns, adSenseTarget);
				}
				(adsbygoogle = window.adsbygoogle || []).push({});
			});
		}

	} catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Google AdSense Async Dynamic - dtmTag: adSenseDyn');
		NREUM.noticeError(dtmErr);
	}
})();
});
