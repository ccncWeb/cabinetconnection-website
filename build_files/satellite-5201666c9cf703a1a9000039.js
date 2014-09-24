_satellite.pushAsyncScript(function(event, target, $variables){
  (function() {
  try {
    $('.search form[name=searchForm]').one('submit', function(e) {
      e.preventDefault();

      var $currentForm = $(this),
        term = $('#searchInput').first().val().toLowerCase();

      if (term.length && term !== 'what are you shopping for?') {
        s.linkTrackVars = 'eVar61';
        s.eVar61 = s.pageName + ':' + term;
        s.tl(this, 'o', s.pageName + ':' + term, null, function() {
          $currentForm.submit();
        });
      }
    });
	} catch (e) {
    var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: SiteCat: Page Name - dtmTag: SiteCat PageName + Searchterm eVar61');
    	NREUM.noticeError(dtmErr);
	}
})();	
});
