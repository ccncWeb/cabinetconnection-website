(function() {
    try{

        var adhesiveUnsecurePixelUrl = "http://ib.adnxs.com/seg?",
            adhesiveSecurePixelUrl = "https://secure.adnxs.com/px?",
            adhesivePixelVars = "",
            dlPage = window.dataLayer.page || '';
        switch (dlPage) {
    				case 'product:display':
          	case 'cart:cart':
                adhesivePixelVars += "add=1571575";
                adhesivePixelVars += "&t=1";
                break;
            case 'checkout:ordercomplete':
                adhesivePixelVars += "id=173215";
                adhesivePixelVars += "&seg=1571576";
                adhesivePixelVars += "&order_id=" + window.dataLayer.orderNumber;
                adhesivePixelVars += "&value=" + window.dataLayer.subTotal;
                adhesivePixelVars += "&t=1";
                break;
            default:
                adhesivePixelVars += "add=1571574";
                adhesivePixelVars += "&t=1";
                break;
        }

        //check page flow, if not in checkout fire pixel unless you are done checking out then fire conversion pixel.
        if (dlPage.indexOf("checkout") < 0 || dlPage === "checkout:ordercomplete") {
            var adhesiveElement = document.createElement('script');
            adhesiveElement.src = (document.location.protocol === "https:" ? adhesiveSecurePixelUrl : adhesiveUnsecurePixelUrl) + adhesivePixelVars;
            adhesiveElement.async = true;
            adhesiveElement.type = "text/javascript";
            var scpt = document.getElementsByTagName('script')[0];
            scpt.parentNode.insertBefore(adhesiveElement, scpt);
        }
    } catch (e) {
    var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: Adhesive Pixel - dtmTag: adhesiveTag');
    NREUM.noticeError(dtmErr);
  }
})();
