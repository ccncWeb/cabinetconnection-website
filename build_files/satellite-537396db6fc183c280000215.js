(function() {
	try {
		var prodCat1 = 'Home & Garden',
			prodCat2 = [{
				name: 'Garden & Outdoor',
				match: ['outdoor', 'garden']
			}, {
				name: 'Home Appliances',
				match: ['appliances']
			}, {
				name: 'Home Decor',
				match: ['decor']
			}, {
				name: 'Home Improvement',
				match: ['home improvement']
			}, {
				name: 'Home Furniture',
				match: ['furniture']
			}],
			prodCat3 = [{
				name: 'BBQ & Grill',
				parent: 'Garden & Outdoor',
				match: ['bbq', 'grill']
			}, {
				name: 'Garden Supplies',
				parent: 'Garden & Outdoor',
				match: ['garden supplies']
			}, {
				name: 'Lawn Mower',
				parent: 'Garden & Outdoor',
				match: ['lawn mower', 'mower']
			}, {
				name: 'Outdoor Lighting',
				parent: 'Garden & Outdoor',
				match: ['outdoor lighting']
			}, {
				name: 'Outdoor Furniture',
				parent: 'Garden & Outdoor',
				match: ['outdoor furniture']
			}, {
				name: 'Cooking Range/Stove',
				parent: 'Home Appliances',
				match: ['range', 'stove', 'oven']
			}, {
				name: 'Dishwasher',
				parent: 'Home Appliances',
				match: ['dishwasher']
			}, {
				name: 'Microwave',
				parent: 'Home Appliances',
				match: ['microwave']
			}, {
				name: 'Refrigerator',
				parent: 'Home Appliances',
				match: ['refrigerator']
			}, {
				name: 'Small Appliances',
				parent: 'Home Appliances',
				match: ['small appliances']
			}, {
				name: 'Washer/Dryer',
				parent: 'Home Appliances',
				match: ['washer', 'dryer']
			}, {
				name: 'Art & Wall Decor',
				parent: 'Home Decor',
				match: ['art', 'wall decor']
			}, {
				name: 'Bath Towels & Accessories',
				parent: 'Home Decor',
				match: ['towels', 'accessories']
			}, {
				name: 'Fireplace',
				parent: 'Home Decor',
				match: ['fireplace']
			}, {
				name: 'Lighting',
				parent: 'Home Decor',
				match: ['lighting']
			}, {
				name: 'Rugs',
				parent: 'Home Decor',
				match: ['rug']
			}, {
				name: 'Bathroom & Kitchen Cabinets',
				parent: 'Home Improvement',
				match: ['cabinet', 'vanity']
			}, {
				name: 'Bathroom & Kitchen Counters',
				parent: 'Home Improvement',
				match: ['top', 'counter']
			}, {
				name: 'Flooring & Decks',
				parent: 'Home Improvement',
				match: ['flooring', 'deck']
			}, {
				name: 'Plumbing Fixtures',
				parent: 'Home Improvement',
				match: ['faucet', 'tap', 'filler', 'sink', 'toilet', 'bidet', 'tub', 'shower']
			}, {
				name: 'Tools',
				parent: 'Home Improvement',
				match: ['tool']
			}],
			crumbs,
			cartItem,
			cartItemName,
			dlBreadcrumbs = window.dataLayer.breadcrumbs || '',
			dlCartItems = window.dataLayer.cartItems || 0,
			dlFinishes = window.dataLayer.finishes || [],
			dlManufacturer = window.dataLayer.manufacturer || '',
			dlPage = window.dataLayer.page || '',
			dlProductId = window.dataLayer.productId || '';

		window.google_partner_params = {
			PROD_Currency: 'USD'
		};

		function buildProdCats() {
			var i, j, k;
			//top level prod cat never changes set it first
			window.google_partner_params.PROD_Cat1 = prodCat1;
			//split breadcrumbs string into an array
			crumbs = dlBreadcrumbs.split('|');
			//loop all prodCat3 objects
			for (i = 0; i < prodCat3.length; i++) {
				//loop all sting match vars inside the prodCat3 objects
				for (j = 0; j < prodCat3[i].match.length; j++) {
					//loop the crumbs array
					for (k = 0; k < crumbs.length; k++) {
						//if the current match value is part of the current crumb,
						//set the proper third and second level prod cats and break out the loop
						if (crumbs[k].toLowerCase().indexOf(prodCat3[i].match[j]) > -1) {
							window.google_partner_params.PROD_Cat3 = prodCat3[i].name;
							window.google_partner_params.PROD_Cat2 = prodCat3[i].parent;
							break;
						}
					}
				}
			}
			//if there was no match in prodCat3 array, then check the prodCat2 array
			if (window.google_partner_params.PROD_Cat2 === undefined) {
				//loop all prodCat2 objects
				for (i = 0; i < prodCat2.length; i++) {
					//loop all sting match vars inside the prodCat2 objects
					for (j = 0; j < prodCat2[i].match.length; j++) {
						//loop the crumbs array
						for (k = 0; k < crumbs.length; k++) {
							//if the current match value is part of the current crumb,
							//set the proper second level prod cat and break out the loop
							if (crumbs[k].toLowerCase().indexOf(prodCat2[i].match[j]) > -1) {
								window.google_partner_params.PROD_Cat2 = prodCat2[i].name;
								break;
							}
						}
					}
				}
				//if no matches to crubs, default prodCat2 = home improvement
				if (window.google_partner_params.PROD_Cat2 === undefined) {
					window.google_partner_params.PROD_Cat2 = "Home Improvement";
				}
			}
		}

		switch (dlPage) {
			case 'main:home':
				break;
			case 'product:display':
				window.google_partner_params.PROD_Action  =  'VIEW_DETAILS';
				window.google_partner_params.PROD_Name = dlManufacturer + ' ' + dlProductId;
				window.google_partner_params.PROD_Brand = dlManufacturer;
				//send them the highest price for product family
				window.google_partner_params.PROD_Price = 0;
				for (var i = 0; i < dlFinishes.length; i++) {
					if (dlFinishes[i].price > window.google_partner_params.PROD_Price) {
						window.google_partner_params.PROD_Price = dlFinishes[i].price;
					}
				}
				buildProdCats();
				break;
			case 'browse:category':
				window.google_partner_params.PROD_Action = 'VIEW_LIST';
				buildProdCats();
				break;
			case 'search:browse':
				window.google_partner_params.PROD_Action = 'VIEW_LIST';
				buildProdCats();
				break;
			case 'cart:cart':
			case 'product:maywesuggest':
			case 'product:configureaccessory':
				//since we dont know anything about the 1 item that was added from dataLayer we can only pass PROD_Action
				window.google_partner_params.PROD_Action  =  'ADD_CART';
				break;
			case 'checkout:ordercomplete':
				var cartItem = '';
				window.google_partner_params.PROD_Action  = 'PURCHASED';
				window.google_partner_params.PROD_Name = [];
				window.google_partner_params.PROD_Brand = [];
				window.google_partner_params.PROD_Price = [];

				for (var i = 0; i < dlCartItems.length; i++) {
					cartItem = dlCartItems[i];
					cartItemName = cartItem.manufacturer + ' ' + cartItem.productId;
					window.google_partner_params.PROD_Name.push(cartItemName);
					window.google_partner_params.PROD_Brand.push(cartItem.manufacturer);
					window.google_partner_params.PROD_Price.push(cartItem.price);
				}
				break;
		}

		//check to see if conversion function is available on page.
		if (typeof window.google_trackConversion !== 'undefined') {
			//fire data to async script
			window.google_trackConversion({
				google_conversion_id: 974722015,
				google_conversion_label: "VMsJCOfq3wQQ-aqt5wM",
				google_custom_params: window.google_partner_params,
				google_remarketing_only: true
			});
		}
	} catch (e) {
    	var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Google Partnership - dtmTag: partnerPixel');
    	NREUM.noticeError(dtmErr);
	}
})();	
