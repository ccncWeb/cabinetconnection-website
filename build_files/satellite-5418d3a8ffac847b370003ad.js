(function() {
	try {
		var dlPage = window.dataLayer.page || '',
			dlProductCount = window.dataLayer.totalProducts || 0,
			dlCartItems = window.dataLayer.cartItems || [],
			dlOrderNumber = window.dataLayer.orderNumber || 0,
			dlCartTotal = window.dataLayer.cartTotal || 0,
			dlOrderSummary = window.dataLayer.orderSummary || '',
			dlTotalTax = dlOrderSummary.totalTax || '',
			dlShippingCost = dlOrderSummary.shippingCost || '',
			dlShipCity = dlOrderSummary.shipCity || '',
			dlShipState = dlOrderSummary.shipState || '',
			dlShipCountry = dlOrderSummary.shipCountry || '',
			allGoogleAnalyicsIDs = {
				'build.com': 'UA-533192-19',
				'faucetdirect.com': 'UA-533192-6',
				'handlesets.com': 'UA-533192-9',
				'lightingdirect.com': 'UA-533192-7',
				'pullsdirect.com': 'UA-533192-10',
				'ventingpipe.com': 'UA-533192-17',
				'faucet.com': 'UA-6688271-2',
				'lightingshowplace.com': 'UA-6688271-3',
				'floormall.com': 'UA-881110-1',
				'ventingdirect.com': 'UA-778741-1',
				'test': 'UA-533192-25'
			},
			domainArray = document.domain.split('.'),
			currentDomain = domainArray[domainArray.length - 2] + '.' + domainArray[domainArray.length - 1],
			dlEnvironment = window.dataLayer.environment || 'production',
			currentGAID = (dlEnvironment === 'production' ? allGoogleAnalyicsIDs[currentDomain] : allGoogleAnalyicsIDs.test),
			currentItemSubItems,
			dlFinishes,
			dlFinishUniqueID,
			pageId;

		window._gaq = window._gaq || [];
		window._gaq.push(['_setAccount', currentGAID]);
		window._gaq.push(['_setDomainName', '.' + window.location.host.split('.').slice(1, 3).join('.')]);
		window._gaq.push(['_trackPageview']);

		switch (dlPage) {
			case 'product:display':
			 	dlFinishes = window.dataLayer.finishes || [];
			 	dlFinishUniqueID = window.dataLayer.product.finishUniqueID || false;
				pageId = dlFinishUniqueID ? dlFinishUniqueID : dlFinishes[0].uniqueId;
					window._gaq.push(['_setCustomVar', 1, 'GCS_ProductID', pageId, 3]);
				break;
			case 'search:browse':
				if (dlProductCount === 0) {
					window._gaq.push(['_setCustomVar', 1, 'GCS_ZeroResults', 'true', 3]);
				}
				break;
			case 'checkout:ordercomplete':
				if (dlCartItems.length) {
					window._gaq.push([
						'_addTrans',
						dlOrderNumber,
						'Build.com',
						dlCartTotal.toFixed(2),
						dlTotalTax,
						dlShippingCost,
						dlShipCity,
						dlShipState,
						dlShipCountry
					]);

					for (var i = 0; i < dlCartItems.length; i++) {
						window._gaq.push([
							'_addItem',
							dlOrderNumber,
							dlCartItems[i].uniqueId,
							dlCartItems[i].manufacturer + ' ' + dlCartItems[i].productId,
							dlCartItems[i].manufacturer,
							dlCartItems[i].price,
							dlCartItems[i].quantity
						]);
						//don't forget subitems.
						if(dlCartItems[i].subItems){
							currentItemSubItems = dlCartItems[i].subItems;
							for(var j = 0; j < currentItemSubItems.length; j++){
								window._gaq.push([
									'_addItem',
									dlOrderNumber,
									currentItemSubItems[j].uniqueId,
									currentItemSubItems[j].manufacturer + ' ' + currentItemSubItems[j].productId,
									currentItemSubItems[j].manufacturer,
									currentItemSubItems[j].price,
									currentItemSubItems[j].quantity
								]);
							}
						}	
					}
				}
				window._gaq.push(['_trackTrans']);
				break;
		}

		(function() {
			var s = '',
				ga = '';
			ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
			s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(ga, s);
		})();

	} catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Google Analytics: Global - dtmTag: Google Analytics: Global');
		NREUM.noticeError(dtmErr);
	}
})();
