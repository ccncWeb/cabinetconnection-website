_satellite.pushBlockingScript(function(event, target, $variables){
  $(function() {
	var i, cartItemName, dlPage = window.dataLayer.page || '',
		dlProduct = window.dataLayer.product || {},
		dlFinishes = window.dataLayer.finishes || [],
		dlManufacturer = window.dataLayer.manufacturer || '',
		dlProductId = window.dataLayer.productId || 0,
		dlPrice = window.dataLayer.price || 0,
		dlCartItems = window.dataLayer.cartItems || [],
		dlSubTotal = window.dataLayer.subTotal || 0;

	window.google_remarketing_params = {
		prodid: '',
		pagetype: '',
		pname: '',
		pcat: '',
		pvalue: '',
		use_case: 'retail'
	};
	switch (dlPage) {
		case 'main:home':
			window.google_remarketing_params.pagetype = 'home';
			break;
		case 'product:display':
			// var prodId = window.location.href.match(/[sp]([\d]+)/);
			window.google_remarketing_params.pagetype = 'product';
			window.google_remarketing_params.prodid = dlProduct.finishUniqueID || dlFinishes[0].uniqueId;
			window.google_remarketing_params.pname = dlManufacturer + ' ' + dlProductId;
			window.google_remarketing_params.pvalue = dlPrice;
			break;
		case 'cart:cart':
		case 'product:maywesuggest':
		case 'product:configureaccessory':
			var cartItem = '',
				cartSubTotal = 0;
			window.google_remarketing_params.pagetype = 'cart';
			window.google_remarketing_params.prodid = [];
			window.google_remarketing_params.pname = [];
			if (dlCartItems.length) {
				for (i = 0; i < dlCartItems.length; i++) {
					cartItem = dlCartItems[i];
					cartSubTotal += (cartItem.quantity * cartItem.price);
					cartItemName = cartItem.manufacturer + ' ' + cartItem.productId;
					window.google_remarketing_params.prodid.push(cartItem.uniqueId);
					window.google_remarketing_params.pname.push(cartItemName);
				}
			}
			if (dlSubTotal) {
				window.google_remarketing_params.pvalue = dlSubTotal;
			} else {
				window.google_remarketing_params.pvalue = cartSubTotal;
			}
			break;
		case 'browse:category':
		case 'search:browse':
			var crumbs = jQuery('#breadcrumb').text().split('>');
			var cat = crumbs[crumbs.length - 1];
			cat = jQuery.trim(cat);
			window.google_remarketing_params.pcat = cat;
			window.google_remarketing_params.pagetype = 'category';
			break;
		case 'checkout:ordercomplete':
			window.google_remarketing_params.pagetype = 'purchase';
			window.google_remarketing_params.prodid = [];
			window.google_remarketing_params.pname = [];
			window.google_remarketing_params.pvalue = dlSubTotal;
			for (i = 0; i < dlCartItems.length; i++) {
				cartItem = dlCartItems[i];
				cartItemName = cartItem.manufacturer + ' ' + cartItem.productId;
				window.google_remarketing_params.prodid.push((cartItemName).replace(/[\- \.]+/g, '').toLowerCase());
				window.google_remarketing_params.pname.push(cartItemName);
			}
			break;

	}
	if (typeof window.google_trackConversion !== 'undefined') {
		window.google_trackConversion({
			google_conversion_id: 1022055801,
			google_conversion_label: "VMsJCOfq3wQQ-aqt5wM",
			google_custom_params: window.google_remarketing_params,
			google_remarketing_only: true
		});
	}
});
});
