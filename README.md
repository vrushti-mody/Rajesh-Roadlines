# Rajesh Roadlines (RRPL): website and platform

| Folder | What it is | Status |
|---|---|---|
| [`website/`](website/README.md) | The new one-page public site for rajeshrpl.in: static HTML, CSS and JS with no build step | Ready to deploy once the logo, WhatsApp number and translations are checked |
| [`platform/`](platform/README.md) | The production app at app.rajeshrpl.in: shipper tools, staff admin, public API and chatbot (Next.js, Payload CMS, PostgreSQL) | Code complete; needs `npm install`, a first build, and RRPL's LR system details for tracking |

The two are connected through `website/assets/config.js`. With the endpoints empty, the website works on its own: tracking opens the old tracking page and forms open an email. Point the endpoints at the platform, and tracking, requests and the news feed all go live from the CMS.
