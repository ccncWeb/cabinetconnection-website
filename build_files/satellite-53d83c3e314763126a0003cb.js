	var _caq = _caq || [],
		dlPage = window.dataLayer.page || '',
		dlCartItems = window.dataLayer.cartItems || [],
		dlOrderNumber = window.dataLayer.orderNumber || 0,
		dlSubTotal = window.dataLayer.subTotal || 0,
		caProducts = [];

	if (dlPage === 'checkout:ordercomplete') {
		if (dlCartItems.length) {
			for (var i = 0; i < dlCartItems.length; i++) {
				caProducts.push({
					Sku: dlCartItems[i].uniqueId,
					Revenue: dlCartItems[i].price,
					Quantity: dlCartItems[i].quantity
				});
				if (typeof dlCartItems[i].subItems !== 'undefined') {
					for (var j = 0; j < dlCartItems[i].length; j++) {
						caProducts.push({
							Sku: dlCartItems[i].uniqueId,
							Revenue: dlCartItems[i].price,
							Quantity: dlCartItems[i].quantity
						});
					}
				}
			}
		}
		try {
			_satellite.notify(JSON.stringify(caProducts), 1);
			_caq.push([
				"Order", {
					EventTypeID: '3',
					OrderId: dlOrderNumber,
					Revenue: dlSubTotal,
					CurrencyCode: 'USD',
					ProductSeparator: '|',
					Products: caProducts
				}
			]);
			_satellite.notify(JSON.stringify(_caq), 1);

			var ca = document.createElement("script");
			ca.type = "text/javascript";
			ca.async = true;
			ca.id = "_casrc";
			ca.src = "//t.channeladvisor.com/v2/43000574.js";
			var caS = document.getElementsByTagName("script")[0];
			caS.parentNode.insertBefore(ca, caS);

		} catch (e) {

		}
	}
