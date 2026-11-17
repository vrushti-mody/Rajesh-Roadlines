/**
 * First-run data. Safe to run again: it skips anything that already exists.
 *   npm run seed
 *
 * Branches come from the live rajeshrpl.in network page (Nov 2026).
 * Lanes, trucks and the hazardous list are STARTING POINTS marked unverified:
 * operations must check them in the admin before launch.
 */
import { getPayload } from "payload";
import config from "../src/payload.config";
import seed from "../src/seed/branches.json" with { type: "json" };

type SeedBranch = { town: string; region: string; kind: string; phones: string[]; address: string; order: number };

const LANES: [string, string, string, number][] = [
  // origin, destination, cut-off (IST), transit days
  ["mumbai", "mumbai", "16:00", 1], ["mumbai", "konkan", "18:00", 1], ["mumbai", "goa", "18:00", 1], ["mumbai", "gujarat", "19:00", 1],
  ["gujarat", "mumbai", "17:00", 1], ["gujarat", "konkan", "17:00", 2], ["gujarat", "goa", "17:00", 2], ["gujarat", "gujarat", "17:00", 1],
  ["goa", "mumbai", "16:00", 1], ["goa", "konkan", "16:00", 1], ["goa", "goa", "15:00", 1], ["goa", "gujarat", "16:00", 2],
  ["konkan", "mumbai", "15:00", 1], ["konkan", "goa", "15:00", 1], ["konkan", "konkan", "14:00", 1], ["konkan", "gujarat", "15:00", 2],
];

// Body sizes are typical Indian market figures for the fleet types RRPL lists; confirm against the actual fleet.
const TRUCKS = [
  { name: "Pick-up 1 t (8 ft)", lengthFt: 8, widthFt: 5, heightFt: 5, payloadKg: 1000 },
  { name: "Canter 3.5 t (14 ft)", lengthFt: 14, widthFt: 6, heightFt: 6, payloadKg: 3500 },
  { name: "LPT 8 t (19 ft)", lengthFt: 19, widthFt: 7, heightFt: 7, payloadKg: 8000 },
  { name: "Container body 9 t (22 ft)", lengthFt: 22, widthFt: 7.5, heightFt: 7.5, payloadKg: 9000 },
  { name: "Truck 10 t (24 ft)", lengthFt: 24, widthFt: 8, heightFt: 8, payloadKg: 10000 },
  { name: "Multi-axle 16 t (24 ft)", lengthFt: 24, widthFt: 8, heightFt: 8, payloadKg: 16000 },
  { name: "20 ft trailer", lengthFt: 20, widthFt: 8, heightFt: 8, payloadKg: 20000 },
  { name: "40 ft trailer", lengthFt: 40, widthFt: 8, heightFt: 8, payloadKg: 26000 },
];

// Common chemicals moved in packs. Status is a placeholder for the hazmat desk to confirm.
const HAZMAT = [
  { un: "1263", name: "Paint (including lacquer, enamel, varnish)", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1210", name: "Printing ink, flammable", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1090", name: "Acetone", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1219", name: "Isopropanol (isopropyl alcohol)", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1294", name: "Toluene", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1307", name: "Xylenes", hazardClass: "3", packingGroup: "III", status: "accepted" },
  { un: "1993", name: "Flammable liquid, n.o.s.", hazardClass: "3", status: "conditional", conditions: "MSDS review by the hazmat desk before booking" },
  { un: "1830", name: "Sulphuric acid", hazardClass: "8", packingGroup: "II", status: "conditional", conditions: "acid-resistant packaging, loaded upright, kept apart from alkalis" },
  { un: "1789", name: "Hydrochloric acid", hazardClass: "8", packingGroup: "II", status: "conditional", conditions: "acid-resistant packaging, loaded upright, kept apart from alkalis" },
  { un: "1824", name: "Sodium hydroxide solution", hazardClass: "8", packingGroup: "II", status: "accepted" },
  { un: "1791", name: "Hypochlorite solution", hazardClass: "8", packingGroup: "III", status: "accepted" },
  { un: "2014", name: "Hydrogen peroxide, aqueous solution", hazardClass: "5.1", packingGroup: "II", status: "conditional", conditions: "vented packaging, kept away from flammables" },
  { un: "1950", name: "Aerosols", hazardClass: "2.1", status: "conditional", conditions: "in outer cartons, no loose cans" },
  { un: "1017", name: "Chlorine", hazardClass: "2.3", status: "refused" },
  { un: "1005", name: "Ammonia, anhydrous", hazardClass: "2.3", status: "refused" },
  { un: "1203", name: "Petrol (gasoline)", hazardClass: "3", packingGroup: "II", status: "refused" },
] as const;

async function main() {
  const payload = await getPayload({ config });
  const aliases = (seed as { aliases: Record<string, string> }).aliases;

  const existingBranches = await payload.count({ collection: "branches" });
  if (existingBranches.totalDocs === 0) {
    for (const b of (seed as { branches: SeedBranch[] }).branches) {
      const al = Object.entries(aliases).filter(([, town]) => town === b.town).map(([a]) => a).join(", ");
      await payload.create({
        collection: "branches",
        data: {
          town: b.town, region: b.region as "mumbai", kind: b.kind as "office", phones: b.phones.map((number) => ({ number })),
          address: b.address || undefined, aliases: al || undefined, order: b.order, active: true,
        },
      });
    }
    payload.logger.info("Seeded branches");
  }

  if ((await payload.count({ collection: "lanes" })).totalDocs === 0) {
    for (const [origin, destination, cutoff, transitDays] of LANES) {
      await payload.create({ collection: "lanes", data: { origin: origin as "mumbai", destination: destination as "mumbai", cutoff, transitDays, doorstepExtraDays: 1, closedDays: ["0"], verified: false } });
    }
    payload.logger.info("Seeded lanes (unverified)");
  }

  if ((await payload.count({ collection: "trucks" })).totalDocs === 0) {
    for (const t of TRUCKS) await payload.create({ collection: "trucks", data: { ...t, active: true } });
    payload.logger.info("Seeded trucks");
  }

  if ((await payload.count({ collection: "hazardous-goods" })).totalDocs === 0) {
    for (const h of HAZMAT) await payload.create({ collection: "hazardous-goods", data: { ...h } as never });
    payload.logger.info("Seeded hazardous goods (to confirm)");
  }

  if ((await payload.count({ collection: "updates" })).totalDocs === 0) {
    await payload.create({
      collection: "updates",
      data: { title: "Mahindra Rising Star: Jigar Somaiya", kind: "news", severity: "info", summary: "Director Jigar Somaiya recognised as a Mahindra Rising Star.", startsAt: new Date().toISOString(), _status: "published" },
    });
  }

  const email = process.env.SEED_ADMIN_EMAIL, password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password && (await payload.count({ collection: "users" })).totalDocs === 0) {
    await payload.create({ collection: "users", data: { email, password, name: "RRPL Admin", role: "admin" } });
    payload.logger.info(`Created admin ${email}`);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
