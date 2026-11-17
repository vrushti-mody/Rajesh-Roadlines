/** Server-side reads from the CMS, shared by pages, API routes and the chatbot. */
import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Lane } from "./bookby";
import type { HazGood } from "./hazmat";
import type { Truck } from "./pack";
import { feetToCm } from "./pack";
import { DEFAULT_THRESHOLDS, type EwayThresholds } from "./ewaybill";
import { DEFAULT_REFUSED_CLASSES } from "./hazmat";

export const payload = () => getPayload({ config });

export interface BranchView {
  id: string; town: string; region: string; kind: string; branchCode?: string;
  phones: string[]; address?: string; aliases: string[];
}

export async function getBranches(): Promise<BranchView[]> {
  const p = await payload();
  const { docs } = await p.find({ collection: "branches", where: { active: { equals: true } }, sort: "order", limit: 500, depth: 0 });
  return docs.map((b) => ({
    id: String(b.id), town: b.town, region: b.region, kind: b.kind, branchCode: b.branchCode ?? undefined,
    phones: (b.phones ?? []).map((x) => x.number), address: b.address ?? undefined,
    aliases: (b.aliases ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  }));
}

export async function getLanes(): Promise<(Lane & { verified: boolean })[]> {
  const p = await payload();
  const { docs } = await p.find({ collection: "lanes", limit: 200, depth: 0 });
  return docs.map((l) => ({
    origin: l.origin, destination: l.destination, cutoff: l.cutoff, transitDays: l.transitDays,
    doorstepExtraDays: l.doorstepExtraDays ?? 1, closedDays: (l.closedDays ?? ["0"]).map(Number), verified: !!l.verified,
  }));
}

export async function getHazmat(): Promise<HazGood[]> {
  const p = await payload();
  const { docs } = await p.find({ collection: "hazardous-goods", limit: 1000, depth: 0, sort: "un" });
  return docs.map((g) => ({ un: g.un, name: g.name, hazardClass: g.hazardClass, packingGroup: g.packingGroup ?? undefined, status: g.status, conditions: g.conditions ?? undefined }));
}

export async function getTrucks(): Promise<Truck[]> {
  const p = await payload();
  const { docs } = await p.find({ collection: "trucks", where: { active: { equals: true } }, limit: 50, depth: 0, sort: "lengthFt" });
  return docs.map((t) => ({ id: String(t.id), name: t.name, l: feetToCm(t.lengthFt), w: feetToCm(t.widthFt), h: feetToCm(t.heightFt), payloadKg: t.payloadKg }));
}

export interface UpdateView { id: string; title: string; kind: string; severity: string; regions: string[]; summary: string; startsAt: string; endsAt?: string }

/** Published updates that have started and not yet ended, newest first. */
export async function getActiveUpdates(limit = 20): Promise<UpdateView[]> {
  const p = await payload();
  const now = new Date().toISOString();
  const { docs } = await p.find({
    collection: "updates", limit, depth: 0, sort: "-startsAt",
    where: { and: [
      { _status: { equals: "published" } },
      { startsAt: { less_than_equal: now } },
      { or: [{ endsAt: { exists: false } }, { endsAt: { greater_than: now } }] },
    ] },
  });
  return docs.map((u) => ({
    id: String(u.id), title: u.title, kind: u.kind, severity: u.severity ?? "info", regions: u.regions ?? [],
    summary: u.summary, startsAt: u.startsAt, endsAt: u.endsAt ?? undefined,
  }));
}

export async function getSettings() {
  const p = await payload();
  const s = await p.findGlobal({ slug: "site-settings", depth: 0 });
  const eway: EwayThresholds = { ...DEFAULT_THRESHOLDS, ...Object.fromEntries(Object.entries(s.eway ?? {}).filter(([, v]) => typeof v === "number")) };
  const refused = (s.refusedClasses ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  return {
    phone: s.phone ?? "022-62284444",
    email: s.email ?? "info@rajeshrpl.in",
    whatsappNumber: s.whatsappNumber ?? undefined,
    eway,
    refusedClasses: refused.length ? refused : DEFAULT_REFUSED_CLASSES,
    chatbotEnabled: s.chatbot?.enabled !== false,
    chatbotExtra: s.chatbot?.extraInstructions ?? "",
  };
}
