(function() {
  try{
    function getUrlData(url) {
      var urlSplit = url.split('?'),
        domain = urlSplit[0].replace(/http(s)*:\/\//, ''),
        query = {};

      if (urlSplit.length > 1) {
        var queryString = urlSplit[1].split('&');

        _satellite.each(queryString, function(item) {
          var val = item.split('=');
          query[val[0]] = decodeURIComponent(val[1]);

        });
      }

      if (domain.indexOf("/", domain.length - 1) !== -1) {
        domain = domain.slice(0, domain.length - 1);
      }

      return {
        domain: domain,
        query: query
      };
    }

    var urlData = getUrlData(document.referrer),
      referrers = [{
        site: 'www.google.com',
        source: 'googleorganic',
        term: 'q'
      }, {
        site: 'google.com/imgres',
        source: 'googleorganic-image',
        term: 'q'
      }, {
        site: 'www.bing.com',
        source: 'bingorganic',
        term: 'q'
      }, {
        site: 'www.bing.com/images',
        source: 'bingorganic-image',
        term: 'q'
      }, {
        site: 'yahoo.com',
        source: 'yahooorganic',
        term: 'p'
      }, {
        site: 'images.search.yahoo.com',
        source: 'yahooorganic-image',
        term: 'p'
      }, {
        site: 'ask.com',
        source: 'askorganic',
        term: 'q'
      }, {
        site: 'aol.com',
        source: 'aolorganic',
        term: 'q'
      }],
      source = '',
      term = '',
      isLocal = (dataLayer.isLocalUser === 'true'),
      matchedReferrer = false;

    if (urlData.domain !== '') {
      _satellite.each(referrers, function(item) {
        if (urlData.domain.indexOf(item.site) > -1) {
          matchedReferrer = true;
          if (item.source == null) {
            source = item.site + 'organic';
          } else {
            source = item.source;
          }
          if (urlData.query[item.term] != null && urlData.query[item.term].length) {
            term = urlData.query[item.term].replace(/\+/gi, ' ');
          } else {
            term = 'keyword-unavailable';
          }
        }
      });

      if (!matchedReferrer) {
        if (urlData.query.q) {
          term = urlData.query.q.replace(/\+/gi, ' ');
          term = '_' + term;
        }
      }

      if (source.length) {
        s.campaign = source + '_' + term;
      } else {
        var urlDomain = urlData.domain.split('/')[0];
        s.campaign = urlDomain + term;
      }

      if (isLocal) {
        s.campaign = 'employee_' + s.campaign;
      }

      s.eVar10 = s.crossVisitParticipation(s.campaign, 's_cpm', '182', '10', '>', 'purchase');
    }
  } catch (e) {
		var dtmErr = new Error(e + ' || ' + window.location.href + ' || dtmRule: SiteCat: Organic Tracking - dtmTag: SiteCat: Organic Tracking');
		NREUM.noticeError(dtmErr);
  }
}());
