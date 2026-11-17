# RRPL one-page website

A fast, static one-page site for Rajesh Roadlines Pvt. Ltd. It replaces the current WordPress, Elementor and Transida site at rajeshrpl.in.
It has no build step, no database and no plugins. You can upload it to any web host.

```
website/
  index.html          the page
  robots.txt, sitemap.xml
  assets/
    styles.css        design (colours and fonts are at the top in :root)
    app.js            behaviour: language, branch search, tracking, quote form
    data.js           branches, services, fleet, leadership  <- edit content here
    i18n.js           headings and buttons in EN, Marathi, Gujarati, Hindi, Konkani
    config.js         tracking, form and WhatsApp settings  <- edit settings here
    brand/            RRPL logo, favicon (from the old site)
    photos/           hero slider, About and Driver/Fleet/Route photos
    leaders/          portraits of N.D., Chandresh and Jigar Somaiya
    awards/           certificates, award photos and customer letters
    fleet/            44 fleet photos (full size + -sm thumbnails)
    team/             21 "Backbone of RRPL" photos
    icons/            the six service icons from the old site
    network/          Gujarat, Maharashtra and Goa maps
    RRPL-company-profile.pdf
```

## Deploy

Pick one option:

- **Current host (cPanel or FTP).** Back up the WordPress site first. Then upload the contents of `website/` to `public_html/`.
- **Cloudflare Pages or Netlify.** Drag the `website/` folder in, then point `rajeshrpl.in` at the new site.

The links people already use, `/tracking/`, `/request-a-quote/` and `/pan-india-network/`, should keep working. Add redirects to `/#track`, `/#quote` and `/#network`. Example for Netlify or Cloudflare Pages (`_redirects` file):

```
/tracking/            /#track     301
/request-a-quote/     /#quote     301
/pan-india-network/   /#network   301
/contact/             /#contact   301
/about-company/       /#about     301
/our-team/            /#about     301
/fleets/              /#fleet     301
```

**Careful:** while `trackingEndpoint` is null, the Track button opens the **old** tracking page. Before you take WordPress down, either keep the old tracking page running on a subdomain, or switch on the platform's `/api/track`.

## Content carried over from the old site

Everything on the old homepage, About, Our Team, Fleets, Infrastructure & Networks, Contact and News pages is here: logo, hero slider ("Best Partner of Choice"), About text with Vision, Mission and Value, the 50+ years figure, counters, six services with their icons, expertise, Man/Machine/Terrain lists with photos, features, HSSEQ, fleet makes and the garage note, a fleet gallery by type, network maps and hub counts, all branch addresses, phones and emails, leadership portraits and quotes, all awards, the two customer letters (BASF India and a recommendation letter), the "Backbone of RRPL" team gallery, news, registered, corporate and Goa area offices, office hours, and the company profile PDF.

Left out on purpose: the newsletter box (it was not connected to anything) and the Contact page's "established in 1988" text (a template error; everything else says 1969). The old site's raw downloads are in `_old-site/` and `_work/`. Don't upload those folders.

## Fixes compared with the current site

| Current site | New site |
|---|---|
| Counters often render as "0" because they animate in with script | Counters show their figures straight away, with no animation (100+ GPS vehicles, 60+ employees, 20,000+ clients, 33,000+ sq. ft.) |
| Homepage says 35 hubs in one place and "30 branches across India" in another, against 32 listed locations | One source, `data.js`, drives every count; confirm which figure RRPL wants to state |
| Broken phone link `tel:http://022-62284444` | Every number is a working tel: link with +91 |
| "Addresss" typo, a quote form with only 6 fields and no confirmation | Quote and pickup form with validation and a clear confirmation |
| Facebook and LinkedIn links point to the bare facebook.com and linkedin.com | Removed until real profile URLs exist |
| Theme icon loaded from a third-party demo server | No third-party assets except Google Fonts |
| Heavy Elementor and WordPress page weight | About 75 KB of HTML, CSS and JS in total, uncompressed |
| No structured data | Schema.org business data (`MovingCompany`), Open Graph tags, canonical URL, sitemap |
| English only | Headings and buttons in 5 languages |
| One news item with no year; news needs a developer | News reads from `data.js`, or from the platform's live feed (`updatesEndpoint`) that staff edit in the CMS |
| Not tested on mobile or in dark mode | Responsive down to 360 px, dark mode, keyboard focus, reduced motion |

## Before launch

1. **Logo.** The logo is the old site's PNG. If RRPL has a vector (SVG or AI) version, swap it into `assets/brand/` for sharper display.
2. **Translations.** Have a native speaker check `i18n.js`, especially Konkani.
3. **WhatsApp.** Set `whatsappNumber` in `config.js` to the business number.
4. **Network.** Confirm the branch list in `data.js`. The old homepage claimed 8 Gujarat hubs, but only 6 are listed.
5. **Profile PDF.** The profile is the 2021 version (5.5 MB). Consider an updated, lighter PDF.
6. **Content to fill in (`data.js`).** These sections stay hidden until filled:
   - `gallery`: copy fleet and team photos from the old site's `wp-content/uploads` into `assets/photos/`.
   - `testimonials`: real customer quotes, used with their permission. The old site had only two images with no readable text.
   - `social`: real Facebook and LinkedIn page URLs.

   Also have Chandresh and Jigar Somaiya approve their quotes in `messages`, and add the year to the news item.
7. **Domain email.** Requests go to info@rajeshrpl.in through the visitor's email app until `enquiryEndpoint` is set.

## Connecting to the platform

Once `../platform` is deployed (for example at `app.rajeshrpl.in`), set these in `config.js`:

```js
trackingEndpoint: "https://app.rajeshrpl.in/api/public/track",
enquiryEndpoint:  "https://app.rajeshrpl.in/api/public/enquiries",
updatesEndpoint:  "https://app.rajeshrpl.in/api/public/updates",
```

The page then shows LR status inline, saves requests straight to the CMS, and shows the news and route alerts staff post there. The platform must allow this origin through CORS; it already lists `https://rajeshrpl.in` in `ALLOWED_ORIGINS`.
