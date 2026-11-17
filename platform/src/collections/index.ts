import type { CollectionConfig } from "payload";
import { admin, adminField, anyone, editors, nobody, ops, publishedOrStaff, staff } from "../access";

import { REGIONS } from "../lib/regions";
export { REGIONS };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((label, i) => ({ label, value: String(i) }));

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Settings" },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000, tokenExpiration: 8 * 3600 },
  access: { read: staff, create: admin, update: ({ req, id }) => req.user?.role === "admin" || req.user?.id === id, delete: admin },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role", type: "select", required: true, defaultValue: "ops", access: { update: adminField },
      options: [
        { label: "Admin (everything)", value: "admin" },
        { label: "Editor (website content)", value: "editor" },
        { label: "Operations (enquiries and complaints)", value: "ops" },
      ],
    },
  ],
};

export const Branches: CollectionConfig = {
  slug: "branches",
  admin: { useAsTitle: "town", defaultColumns: ["town", "region", "kind", "active"], group: "Network" },
  access: { read: anyone, create: editors, update: editors, delete: admin },
  defaultSort: "order",
  fields: [
    { name: "town", type: "text", required: true },
    { name: "region", type: "select", required: true, options: REGIONS },
    {
      name: "kind", type: "select", required: true, defaultValue: "office",
      options: [
        { label: "Branch", value: "office" }, { label: "Area office", value: "area-office" },
        { label: "Corporate office", value: "corporate" }, { label: "Door-step delivery (no office)", value: "doorstep" },
        { label: "Official representative", value: "representative" },
      ],
    },
    { name: "branchCode", type: "text", admin: { description: "Code printed on LRs, used for tracking." } },
    { name: "phones", type: "array", fields: [{ name: "number", type: "text", required: true }] },
    { name: "address", type: "textarea" },
    { name: "aliases", type: "text", admin: { description: "Other spellings customers search for, comma separated (e.g. Panaji, Madgaon)." } },
    { name: "active", type: "checkbox", defaultValue: true },
    { name: "order", type: "number", defaultValue: 100, admin: { position: "sidebar" } },
  ],
};

export const Lanes: CollectionConfig = {
  slug: "lanes",
  labels: { singular: "Lane (cut-off and transit)", plural: "Lanes (cut-offs and transit)" },
  admin: { useAsTitle: "label", defaultColumns: ["label", "cutoff", "transitDays", "verified"], group: "Network" },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  hooks: { beforeChange: [({ data, originalDoc }) => ({ ...data, label: `${data.origin ?? originalDoc?.origin} → ${data.destination ?? originalDoc?.destination}` })] },
  fields: [
    { name: "label", type: "text", admin: { hidden: true } },
    { name: "origin", type: "select", required: true, options: REGIONS },
    { name: "destination", type: "select", required: true, options: REGIONS },
    {
      name: "cutoff", type: "text", required: true, defaultValue: "18:00",
      admin: { description: "Last booking time at the origin hub, 24-hour IST, HH:MM." },
      validate: (v: unknown) => (typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v)) || "Use HH:MM, e.g. 18:00",
    },
    { name: "transitDays", type: "number", required: true, min: 0, max: 10, defaultValue: 1 },
    { name: "doorstepExtraDays", type: "number", min: 0, max: 5, defaultValue: 1 },
    { name: "closedDays", type: "select", hasMany: true, options: DAYS, defaultValue: ["0"], admin: { description: "No dispatch or delivery on these days." } },
    { name: "verified", type: "checkbox", defaultValue: false, admin: { description: "Tick once operations has confirmed these times. Unverified lanes show as indicative." } },
  ],
};

export const HazardousGoods: CollectionConfig = {
  slug: "hazardous-goods",
  labels: { singular: "Hazardous good", plural: "Hazardous goods" },
  admin: { useAsTitle: "name", defaultColumns: ["un", "name", "hazardClass", "status"], group: "Shipper tools" },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [
    { name: "un", label: "UN number", type: "text", required: true, unique: true, validate: (v: unknown) => (typeof v === "string" && /^\d{4}$/.test(v)) || "Four digits, e.g. 1263" },
    { name: "name", type: "text", required: true },
    { name: "hazardClass", type: "text", required: true, admin: { description: "e.g. 3, 8, 2.3, 5.1" } },
    { name: "packingGroup", type: "select", options: ["I", "II", "III"] },
    { name: "status", type: "select", required: true, options: [
      { label: "Accepted", value: "accepted" }, { label: "Accepted with conditions", value: "conditional" }, { label: "Refused", value: "refused" },
    ] },
    { name: "conditions", type: "textarea", admin: { condition: (d) => d.status === "conditional" } },
  ],
};

export const Trucks: CollectionConfig = {
  slug: "trucks",
  admin: { useAsTitle: "name", defaultColumns: ["name", "lengthFt", "payloadKg", "active"], group: "Shipper tools" },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [
    { name: "name", type: "text", required: true },
    { type: "row", fields: [
      { name: "lengthFt", type: "number", required: true, min: 6, max: 60 },
      { name: "widthFt", type: "number", required: true, min: 4, max: 10 },
      { name: "heightFt", type: "number", required: true, min: 4, max: 14 },
    ] },
    { name: "payloadKg", type: "number", required: true, min: 500 },
    { name: "active", type: "checkbox", defaultValue: true },
  ],
};

export const Updates: CollectionConfig = {
  slug: "updates",
  labels: { singular: "Update or alert", plural: "Updates and alerts" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "severity", "startsAt", "_status"], group: "Content" },
  versions: { drafts: true },
  access: { read: publishedOrStaff, create: editors, update: editors, delete: editors },
  defaultSort: "-startsAt",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "kind", type: "select", required: true, defaultValue: "news", options: [
      { label: "News", value: "news" }, { label: "Route alert (ghat, road work)", value: "route" },
      { label: "Monsoon alert", value: "monsoon" }, { label: "Holiday / no dispatch", value: "holiday" },
      { label: "Service change", value: "service" },
    ] },
    { name: "severity", type: "select", defaultValue: "info", options: [
      { label: "Information", value: "info" }, { label: "Delays expected", value: "caution" }, { label: "Route closed", value: "closed" },
    ] },
    { name: "regions", type: "select", hasMany: true, options: REGIONS },
    { name: "summary", type: "textarea", required: true, maxLength: 400, admin: { description: "One or two sentences. Shown on the site and used by the chatbot." } },
    { name: "body", type: "richText" },
    { name: "startsAt", type: "date", required: true, defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "endsAt", type: "date", admin: { description: "Alerts disappear after this time.", date: { pickerAppearance: "dayAndTime" } } },
  ],
};

const leadStatus = (options: string[]) => ({
  name: "status", type: "select" as const, defaultValue: options[0], admin: { position: "sidebar" as const },
  options: options.map((o) => ({ label: o[0].toUpperCase() + o.slice(1), value: o })),
});

export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  labels: { singular: "Quote / pickup request", plural: "Quote / pickup requests" },
  admin: { useAsTitle: "reference", defaultColumns: ["reference", "type", "name", "from", "to", "status", "createdAt"], group: "Customers" },
  // Created only through /api/public/enquiries (validated, rate-limited); never through the open REST API.
  access: { read: ops, create: nobody, update: ops, delete: admin },
  fields: [
    { name: "reference", type: "text", required: true, unique: true, admin: { readOnly: true } },
    { name: "type", type: "select", required: true, options: ["Quote", "Pickup"] },
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "company", type: "text" }] },
    { type: "row", fields: [{ name: "phone", type: "text", required: true }, { name: "email", type: "email" }] },
    { type: "row", fields: [{ name: "from", type: "text", required: true }, { name: "to", type: "text", required: true }] },
    { name: "goods", type: "text" },
    { type: "row", fields: [{ name: "weightKg", type: "number" }, { name: "packages", type: "number" }, { name: "pickupDate", type: "date" }] },
    { name: "hazardous", type: "checkbox" },
    { name: "notes", type: "textarea" },
    leadStatus(["new", "contacted", "quoted", "booked", "lost"]),
    { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "internalNotes", type: "textarea", admin: { position: "sidebar" } },
    { name: "source", type: "text", admin: { readOnly: true, position: "sidebar" } },
  ],
};

export const Complaints: CollectionConfig = {
  slug: "complaints",
  labels: { singular: "Problem report", plural: "Problem reports" },
  admin: { useAsTitle: "reference", defaultColumns: ["reference", "lrNumber", "issue", "status", "createdAt"], group: "Customers" },
  access: { read: ops, create: nobody, update: ops, delete: admin },
  fields: [
    { name: "reference", type: "text", required: true, unique: true, admin: { readOnly: true } },
    { name: "lrNumber", type: "text", required: true },
    { name: "issue", type: "select", required: true, options: [
      { label: "Damaged goods", value: "damaged" }, { label: "Short delivery", value: "short" }, { label: "Delayed", value: "delay" },
      { label: "Wrong delivery", value: "wrong" }, { label: "Billing", value: "billing" }, { label: "Other", value: "other" },
    ] },
    { name: "description", type: "textarea", required: true },
    { type: "row", fields: [{ name: "name", type: "text", required: true }, { name: "phone", type: "text", required: true }, { name: "email", type: "email" }] },
    { name: "photos", type: "upload", relationTo: "complaint-files", hasMany: true },
    leadStatus(["new", "investigating", "resolved", "rejected"]),
    { name: "resolution", type: "textarea" },
    { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
  ],
};

/** Public images for news and alerts. */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Content" },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  upload: { mimeTypes: ["image/*"], imageSizes: [{ name: "card", width: 800 }] },
  fields: [{ name: "alt", type: "text", required: true }],
};

/** Customer photos attached to problem reports. Private to staff. */
export const ComplaintFiles: CollectionConfig = {
  slug: "complaint-files",
  admin: { group: "Customers", hidden: ({ user }) => !user },
  access: { read: staff, create: nobody, update: ops, delete: admin },
  upload: { mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"] },
  fields: [{ name: "note", type: "text" }],
};

export const collections = [Users, Branches, Lanes, HazardousGoods, Trucks, Updates, Enquiries, Complaints, Media, ComplaintFiles];
