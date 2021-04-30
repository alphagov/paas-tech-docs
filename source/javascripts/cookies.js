(function (window) {
  'use strict'

  var cookieName = 'govuk-paas-cookie-policy',
      cookieDomain = 'cloud.service.gov.uk',
      cookieDuration = 365,
      trackingId = 'UA-43115970-5';

  // disable tracking by default
  window['ga-disable-' + trackingId] = true;

  hasCookiesPolicy() ? initAnalytics(hasAnalyticsConsent()) : initCookieBanner();
  
  function hasCookiesPolicy() {
    return getCookie(cookieName)
  }

  function hasAnalyticsConsent () {
    var consentCookie = JSON.parse(getCookie(cookieName));
    return consentCookie ? consentCookie.analytics : false
  }

  function getCookie(name) {
    var nameEQ = name + '='
    var cookies = document.cookie.split(';')
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    return null
  }

  function setCookie(name, values, options) {
    if (typeof options === 'undefined') {
      options = {}
    }
  
    var cookieString = name + '=' + values
    if (options.days) {
      var date = new Date()
      date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
      cookieString = cookieString + '; expires=' + date.toGMTString() + ';domain=' + cookieDomain + '; path=/'
    }
    
    if (document.location.protocol === 'https:') {
      cookieString = cookieString + '; Secure';
    }

    document.cookie = cookieString
  }

  function initAnalytics(consent) {
    if (!consent) {
      return
    }

    // guard against being called more than once
    if (!('GoogleAnalyticsObject' in window)) {
  
      window['ga-disable-'+ trackingId] = false;
  
      // Load GTM
      loadGtmScript()
      setupGtm()
    }
  }

  // cookie banner functions

  function initCookieBanner() {

    var $skipLink = document.querySelector('.govuk-skip-link'), //insert after skip link for a11y
        $cookieBanner = document.createElement('div');
    
    $cookieBanner.setAttribute('className','cookie-banner');
    $cookieBanner.setAttribute('role','region');
    $cookieBanner.setAttribute('aria-label','cookie-banner');
    $cookieBanner.innerHTML = '<div class="cookie-banner__wrapper govuk-width-container">\
      <h2 class="govuk-heading-m" id="cookie-banner__heading">\
      Can we store analytics cookies on your device?</h2>\
      <p class="govuk-body">Analytics cookies help us understand how our website is being used.</p>\
      <div class="cookie-banner__buttons">\
      <button class="govuk-button cookie-banner__button cookie-banner__button-accept" \
      type="submit" data-accept-cookies="true" aria-describedby="cookie-banner__heading">\
      Yes <span class="govuk-visually-hidden">, GOV.UK PaaS can store analytics cookies on your device</span></button>\
      <button class="govuk-button cookie-banner__button cookie-banner__button-reject" \
      type="submit" data-accept-cookies="false" aria-describedby="cookie-banner__heading">\
      No <span class="govuk-visually-hidden">, GOV.UK PaaS cannot store analytics cookies on your device</span></button>\
      <a class="govuk-link cookie-banner__link" href="https://www.cloud.service.gov.uk/cookies/">\
      How GOV.UK PaaS uses cookies</a></div></div><div class="cookie-banner__confirmation govuk-width-container" tabindex="-1">\
      <p class="cookie-banner__confirmation-message govuk-body">You can \
      <a class="govuk-link" href="https://www.cloud.service.gov.uk/cookies/">change your cookie settings</a> at any time.</p>\
      <button class="cookie-banner__hide-button govuk-link" data-hide-cookie-banner="true" role="link">\
      Hide <span class="govuk-visually-hidden"> cookies message</span></button></div>';
    
    $skipLink.parentNode.insertBefore($cookieBanner, $skipLink.nextSibling);

    var $hideLink = $cookieBanner.querySelector('button[data-hide-cookie-banner]'),
        $acceptCookiesLink = $cookieBanner.querySelector('button[data-accept-cookies=true]'),
        $rejectCookiesLink = $cookieBanner.querySelector('button[data-accept-cookies=false]');

    $cookieBanner.style.display = 'block';

    $cookieBanner.addEventListener('click', function(e) {
      switch (e.target) {
        case $rejectCookiesLink:
          setBannerCookieConsent($cookieBanner, false);
          break;
        case $acceptCookiesLink:
          setBannerCookieConsent($cookieBanner, true);
          break;
        case $hideLink:
          hideCookieMessage($cookieBanner);
          break;
        default:
          break;
      }
    });
  }

  function setBannerCookieConsent($container, analyticsConsent) {
    var $cookieBannerConfirmationContainer = $container.querySelector('.cookie-banner__confirmation')

    setCookie(cookieName, JSON.stringify({ 'analytics': analyticsConsent }), {days: cookieDuration});
  
    showBannerConfirmationMessage($container, analyticsConsent);
    $cookieBannerConfirmationContainer.focus();
  
    if (analyticsConsent) { 
      initAnalytics(true);
    }
  }

  function showBannerConfirmationMessage($container, analyticsConsent) {
    var messagePrefix = analyticsConsent ? 'You’ve accepted analytics cookies.' : 'You told us not to use analytics cookies.';
    
  
    var $cookieBannerMainContent = $container.querySelector('.cookie-banner__wrapper'),
        $cookieBannerConfirmationMessage = $container.querySelector('.cookie-banner__confirmation-message');
  
    $cookieBannerConfirmationMessage.insertAdjacentText('afterbegin', messagePrefix);
    $cookieBannerConfirmationMessage.parentNode.style.display = 'block';
    $cookieBannerMainContent.style.display = 'none'; 
  }

  function hideCookieMessage($container) {
    $container.style.display = 'none'
  }

  // GTM functions
  function loadGtmScript() {
    var gtmScriptTag = document.createElement("script");
    gtmScriptTag.type = "text/javascript"
    gtmScriptTag.setAttribute("async", "true")
    gtmScriptTag.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=" + trackingId)
    document.documentElement.firstChild.appendChild(gtmScriptTag)
  }

  function setupGtm() {
    // Pull dimensions vals from meta ; else all script/origin combinations have to be in the CSP	
    window.dataLayer = window.dataLayer || [];	
    function gtag(){dataLayer.push(arguments);}	
    gtag('js', new Date());	
  
    var config = {
      cookie_expires: cookieDuration * 24 * 60 * 60,
      page_path: window.location.pathname + window.location.hash,
      // docs get a relatively small number	
      // of visits daily, so the default site speed	
      // sample rate of 1% gives us too few data points.	
      // Settings it to 30% gives us more data.	
      siteSpeedSampleRate: 30,
      anonymize_ip: true,
      linker: {
        domains: [
          'cloud.service.gov.uk',
          'admin.cloud.service.gov.uk',
          'admin.london.cloud.service.gov.uk', 
          'docs.cloud.service.gov.uk'
        ]
      }
    };
  
    gtag('config', trackingId, config);
  }

})(window)
