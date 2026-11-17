import type { GlobalConfig } from "payload";
import { admin, anyone } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Settings" },
  access: { read: anyone, update: admin },
  fields: [
    { type: "row", fields: [
      { name: "phone", type: "text", defaultValue: "022-62284444" },
      { name: "email", type: "email", defaultValue: "info@rajeshrpl.in" },
      { name: "whatsappNumber", type: "text", admin: { description: "Shown on the site, e.g. 9198XXXXXXXX." } },
    ] },
    {
      name: "eway", label: "E-way bill limits (₹)", type: "group",
      admin: { description: "Change when the GST department issues a new notification." },
      fields: [{ type: "row", fields: [
        { name: "interState", type: "number", defaultValue: 50000 },
        { name: "intraMH", label: "Within Maharashtra", type: "number", defaultValue: 100000 },
        { name: "intraGA", label: "Within Goa (notified goods)", type: "number", defaultValue: 50000 },
        { name: "intraGJ", label: "Within Gujarat (specified goods)", type: "number", defaultValue: 50000 },
        { name: "eInvoiceTurnoverCr", label: "E-invoice turnover (₹ crore)", type: "number", defaultValue: 5 },
      ] }],
    },
    { name: "refusedClasses", type: "text", defaultValue: "1, 6.2, 7", admin: { description: "Hazard classes RRPL never carries, comma separated." } },
    {
      name: "chatbot", type: "group", fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "extraInstructions", type: "textarea", admin: { description: "Extra facts or rules for Ask RRPL, e.g. holiday timings." } },
      ],
    },
  ],
};
