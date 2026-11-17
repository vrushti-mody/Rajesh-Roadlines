/* Site settings. Change these values; no other file needs editing to switch them.
 *
 * trackingEndpoint  When the platform (../platform) is live, set to its tracking API,
 *                   e.g. "https://app.rajeshrpl.in/api/public/track". The page then shows LR status inline.
 *                   While null, "Track" opens RRPL's existing tracking page in a new tab.
 * enquiryEndpoint   When set, quote and pickup requests are POSTed here as JSON
 *                   (e.g. "https://app.rajeshrpl.in/api/public/enquiries"). While null, the visitor's
 *                   email app opens with the request filled in, addressed to enquiryEmail.
 * updatesEndpoint   When set (e.g. "https://app.rajeshrpl.in/api/public/updates"), News shows the
 *                   platform's live news and route alerts. While null, it shows the news in data.js.
 * whatsappNumber    RRPL's WhatsApp Business number in international form without "+",
 *                   e.g. "9198XXXXXXXX". While null, WhatsApp buttons are hidden.
 */
window.RRPL_CONFIG = {
  trackingEndpoint: null,
  legacyTrackingUrl: "https://rajeshrpl.in/tracking/",
  enquiryEndpoint: null,
  updatesEndpoint: null,
  enquiryEmail: "info@rajeshrpl.in",
  whatsappNumber: null
};
