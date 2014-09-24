var siteData = {
		'build.com': 2099,
		'ventingdirect.com': 3406,
		'faucet.com': 4708,
		'faucetdirect.com': 2081,
		'lightingdirect.com': 2082,
		'handlesets.com': 3405,
		'pullsdirect.com': 9884
	},
	dlStoreName = window.dataLayer.storeName || '',
	dlSite = dlStoreName.toLowerCase(),
	dlIsProUser = "false" === window.dataLayer.isPro ? 0 : 1,
	criteoScriptTarget = document.getElementsByTagName('script')[0],
	criteoScript = document.createElement('script');
criteoScript.async = true;
criteoScript.src = '//static.criteo.net/js/ld/ld.js';
criteoScript.type = 'text/javascript';


//function to get all cart items and subitems.
//returns: uniqueId, price, and qty for each item to the products array or "no items in cart"
function getCartItems() {
	var products = [],
		subItems = '',
		cartItems = window.dataLayer.cartItems;
	if (cartItems) {
		for (var i = 0; i < cartItems.length; i++) {
			products.push({
				id: cartItems[i].uniqueId,
				price: cartItems[i].price,
				quantity: cartItems[i].quantity
			});
			//check for subitems
			if (cartItems[i].subItems) {
				subItems = cartItems[i].subItems;
				for (var j = 0; j < subItems.length; j++) {
					products.push({
						id: subItems[j].uniqueId,
						price: subItems[j].price,
						quantity: subItems[j].quantity
					});
				}
			}
		}
	} else {
		products.push('no items in cart');
	}
	return products;
}

//function to collect the unique or family ids from the product drop compare inputs.
//accepts: int for number of ids to return
//returns: ids in an array.
function getProductsFromDrop(productCount) {
	var products = document.querySelectorAll('.compare'),
		productIds = [];

	for (var i = 0; i < productCount; i++) {
		productIds.push(products[i].value);
	}
	return productIds;
}

if (siteData[dlSite]) {
	//inject the criteo script
	criteoScriptTarget.parentNode.insertBefore(criteoScript, criteoScriptTarget);

	window.criteo_q = window.criteo_q || [];
	window.criteo_q.push({
		event: 'setAccount',
		account: siteData[dlSite]
	}, {
		event: 'setData',
		ui_partnername: dlSite
	}, {
		event: 'setData',
		ui_isprouser: dlIsProUser
	}, {
		event: 'setSiteType',
		type: 'd'
	});

	//check the page type and push vars to criteo_q array.
	switch (window.dataLayer.page) {
		case 'product:display':
			window.criteo_q.push({
				event: 'viewItem',
				item: window.dataLayer.product.finishUniqueID || window.dataLayer.finishes[0].uniqueId
			});
			break;
		case 'search:browse':
			window.criteo_q.push({
				event: 'viewList',
				item: getProductsFromDrop(3)
			});
			break;
		case 'browse:category':
			//tracking for category page product drops
			if (window.dataLayer.currentPageResults > 0) {
				window.criteo_q.push({
					event: 'viewList',
					item: getProductsFromDrop(3)
				});
			}
			break;
		case 'cart:cart':
			window.criteo_q.push({
				event: 'viewBasket',
				item: getCartItems()
			});
			break;
		case 'checkout:ordercomplete':
			window.criteo_q.push({
				event: 'trackTransaction',
				id: window.dataLayer.orderNumber,
				new_customer: 0,
				item: getCartItems()
			});
			break;
		case 'main:home':
			window.criteo_q.push({
				event: 'viewHome'
			});
			break;
	}
}
