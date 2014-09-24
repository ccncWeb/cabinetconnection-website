(function() {
	try {
    var _qevents = _qevents || [],
    dlPage = window.dataLayer.page || '',
    dlOrderNumber = window.dataLayer.orderNumber || 0,
    dlCartTotal = window.dataLayer.cartTotal || 0,
    dlIsPro = window.dataLayer.isPro || '';

    (function() {
    var elem = document.createElement('script');
    elem.src = (document.location.protocol === "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
    elem.async = true;
    elem.type = "text/javascript";
    var scpt = document.getElementsByTagName('script')[0];
    scpt.parentNode.insertBefore(elem, scpt);
    })();

    var qAcctNum ="p-rPGhNKRR1JyXQ";

    //check page type and build push vars.
    if(dlPage !== 'checkout:ordercomplete'){
      _qevents.push({qacct:""+qAcctNum,labels:"_fp.event.All Events",event:"refresh"});
    } else {
      //Revenue Buckets
      if(dlCartTotal < 251){
        var revBucket = "Low";
      } else if(dlCartTotal > 700) {
        var revBucket = "High";
      }
      else{
        var revBucket = "Medium";
      }
      _qevents.push({qacct:""+qAcctNum,labels:"_fp.event.purchase order confirmation,_fp.customer."+dlIsPro+",_fp.subchannel."+revBucket,orderid:""+dlOrderNumber,revenue:""+dlCartTotal,event:"refresh"});
    }

    //second push for the tracking sam wanted.
    _qevents.push({qacct:"p-kNUr79bTJgmKb"});
  } catch (e) {
    var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Quantcast - dtmTag: quantcastTracking');
    NREUM.noticeError(dtmErr);
	}
})();	
