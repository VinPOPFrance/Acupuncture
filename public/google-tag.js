// Google tag (Google Ads, and Google Analytics 4 once an ID is set in src/content.mjs `clinic.googleTags`).
// Same set-up as the former Wix site, read in its HTML on 2026-11-19: consent mode with every storage denied by default
// and no consent banner, so Google receives cookieless measurement pings and no advertising or analytics cookie is set.
// A separate file because the CSP blocks inline scripts. The IDs come from the data-ads / data-ga attributes.
(function () {
  var me = document.currentScript;
  var ads = me && me.dataset.ads, ga = me && me.dataset.ga;
  if (!ads && !ga) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted'
  });
  gtag('js', new Date());
  if (ads) gtag('config', ads, { anonymize_ip: true });
  if (ga) gtag('config', ga, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ads || ga);
  document.head.appendChild(s);
})();
