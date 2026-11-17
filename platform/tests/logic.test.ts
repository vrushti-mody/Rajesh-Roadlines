import { test } from "node:test";
import assert from "node:assert/strict";
import { checkEwayBill, validityDays } from "../src/lib/ewaybill";
import { nextBookBy, formatCountdown, type Lane } from "../src/lib/bookby";
import { pack, smallestTruck, feetToCm, type Truck, type Item } from "../src/lib/pack";
import { checkHazmat, normaliseUn, type HazGood } from "../src/lib/hazmat";

/* ---------- E-way bill ---------- */
test("inter-state above ₹50k needs an e-way bill", () => {
  const r = checkEwayBill({ fromState: "MH", toState: "GA", valueInr: 85_000, purpose: "sale", distanceKm: 590 });
  assert.equal(r.required, true);
  assert.equal(r.validityDays, 3);
});
test("inter-state at or below ₹50k does not", () => {
  assert.equal(checkEwayBill({ fromState: "MH", toState: "GJ", valueInr: 50_000, purpose: "sale" }).required, false);
  assert.equal(checkEwayBill({ fromState: "MH", toState: "GJ", valueInr: 40_000, purpose: "sale" }).required, false);
});
test("inter-state job work needs one at any value", () => {
  assert.equal(checkEwayBill({ fromState: "GJ", toState: "MH", valueInr: 5_000, purpose: "job-work" }).required, true);
});
test("within Maharashtra the limit is ₹1 lakh", () => {
  assert.equal(checkEwayBill({ fromState: "MH", toState: "MH", valueInr: 85_000, purpose: "sale" }).required, false);
  assert.equal(checkEwayBill({ fromState: "MH", toState: "MH", valueInr: 100_001, purpose: "sale" }).required, true);
});
test("within Goa only notified goods", () => {
  assert.equal(checkEwayBill({ fromState: "GA", toState: "GA", valueInr: 200_000, purpose: "sale" }).required, false);
  assert.equal(checkEwayBill({ fromState: "GA", toState: "GA", valueInr: 60_000, purpose: "sale", notifiedGoods: true }).required, true);
});
test("within one Gujarat city never", () => {
  assert.equal(checkEwayBill({ fromState: "GJ", toState: "GJ", valueInr: 900_000, purpose: "sale", notifiedGoods: true, intraCity: true }).required, false);
});
test("hazardous adds MSDS and TREM card", () => {
  const r = checkEwayBill({ fromState: "MH", toState: "GA", valueInr: 85_000, purpose: "sale", hazardous: true });
  assert.ok(r.documents.some((d) => d.includes("MSDS")));
  assert.ok(r.documents.some((d) => d.includes("TREM")));
});
test("validity days", () => {
  assert.equal(validityDays(200), 1);
  assert.equal(validityDays(201), 2);
  assert.equal(validityDays(45, true), 3);
});

/* ---------- Book-by ---------- */
const lane: Lane = { origin: "mumbai", destination: "goa", cutoff: "18:00", transitDays: 1, closedDays: [0] };
const ist = (s: string) => new Date(s + "+05:30");

test("before the cut-off on a weekday: tonight, deliver tomorrow", () => {
  const r = nextBookBy(lane, ist("2026-11-17T10:00:00")); // Tuesday
  assert.equal(r.rolledOver, false);
  assert.equal(r.cutoffAt.toISOString(), "2026-11-17T12:30:00.000Z");
  assert.equal(r.deliveryDate, "2026-11-18");
  assert.equal(r.msLeft, 8 * 3600_000);
});
test("after the cut-off rolls to the next day", () => {
  const r = nextBookBy(lane, ist("2026-11-17T18:30:00"));
  assert.equal(r.rolledOver, true);
  assert.equal(r.deliveryDate, "2026-11-19");
});
test("Saturday evening skips Sunday for dispatch and delivery", () => {
  const r = nextBookBy(lane, ist("2026-11-21T19:00:00")); // Saturday after cut-off
  assert.equal(r.cutoffAt.toISOString(), "2026-11-23T12:30:00.000Z"); // Monday 18:00 IST
  assert.equal(r.deliveryDate, "2026-11-24");
});
test("Saturday dispatch delivers Monday", () => {
  const r = nextBookBy(lane, ist("2026-11-21T09:00:00"));
  assert.equal(r.deliveryDate, "2026-11-23");
});
test("door-step adds a day", () => {
  assert.equal(nextBookBy(lane, ist("2026-11-17T10:00:00"), true).deliveryDate, "2026-11-19");
});
test("countdown format", () => assert.equal(formatCountdown(3_723_000), "1h 02m 03s"));
test("bad cut-off throws", () => assert.throws(() => nextBookBy({ ...lane, cutoff: "25:00" })));

/* ---------- Packing ---------- */
const t22: Truck = { id: "22", name: "22 ft", l: feetToCm(22), w: feetToCm(7.5), h: feetToCm(7), payloadKg: 9000 };
const t14: Truck = { id: "14", name: "14 ft", l: feetToCm(14), w: feetToCm(6), h: feetToCm(6), payloadKg: 2500 };

test("cartons fill floor then stack, no overlaps", () => {
  const items: Item[] = [{ id: "c", name: "Carton", l: 60, w: 40, h: 40, kg: 15, qty: 120 }];
  const r = pack(t22, items);
  assert.equal(r.fitsAll, true);
  assert.equal(r.placements.length, 120);
  for (let i = 0; i < r.placements.length; i++) for (let j = i + 1; j < r.placements.length; j++) {
    const a = r.placements[i], b = r.placements[j];
    const ov = a.x < b.x + b.l && a.x + a.l > b.x && a.y < b.y + b.h && a.y + a.h > b.y && a.z < b.z + b.w && a.z + a.w > b.z;
    assert.equal(ov, false, `boxes ${i} and ${j} overlap`);
  }
  for (const p of r.placements) {
    assert.ok(p.x + p.l <= t22.l && p.y + p.h <= t22.h && p.z + p.w <= t22.w, "inside body");
  }
});
test("weight limit stops loading", () => {
  const r = pack(t14, [{ id: "d", name: "Drum", l: 60, w: 60, h: 90, kg: 230, qty: 12 }]);
  assert.equal(r.fitsAll, false);
  assert.ok(r.usedKg <= 2500);
  assert.equal(r.unplaced[0].reason, "weight");
});
test("non-stackable items get nothing on top", () => {
  const r = pack(t14, [{ id: "p", name: "Pallet", l: 120, w: 100, h: 100, kg: 300, qty: 3, stackable: false },
                       { id: "c", name: "Carton", l: 40, w: 30, h: 30, kg: 5, qty: 10 }]);
  const pallets = r.placements.filter((p) => p.itemId === "p");
  for (const c of r.placements.filter((p) => p.itemId === "c")) {
    for (const pl of pallets) {
      const onTop = Math.abs(c.y - (pl.y + pl.h)) < 0.01 && c.x < pl.x + pl.l && c.x + c.l > pl.x && c.z < pl.z + pl.w && c.z + c.w > pl.z;
      assert.equal(onTop, false);
    }
  }
});
test("too-big item is reported", () => {
  const r = pack(t14, [{ id: "x", name: "Machine", l: 500, w: 250, h: 100, kg: 900, qty: 1 }]);
  assert.equal(r.unplaced[0].reason, "too-big");
});
test("smallest truck picks 14 ft for a light load", () => {
  const s = smallestTruck([t22, t14], [{ id: "c", name: "Carton", l: 60, w: 40, h: 40, kg: 15, qty: 20 }]);
  assert.equal(s?.truck.id, "14");
});

/* ---------- Hazmat ---------- */
const list: HazGood[] = [
  { un: "1263", name: "Paint", hazardClass: "3", packingGroup: "II", status: "accepted" },
  { un: "1830", name: "Sulphuric acid", hazardClass: "8", packingGroup: "II", status: "conditional", conditions: "acid-resistant drums, upright" },
  { un: "1017", name: "Chlorine", hazardClass: "2.3", status: "refused" },
  { un: "0012", name: "Cartridges", hazardClass: "1.4", status: "accepted" },
];
test("UN parsing", () => {
  assert.equal(normaliseUn("UN1263"), "1263");
  assert.equal(normaliseUn(" un 1830 "), "1830");
  assert.equal(normaliseUn("12"), null);
});
test("hazmat statuses", () => {
  assert.equal(checkHazmat("UN1263", list).status, "accepted");
  assert.equal(checkHazmat("1830", list).status, "conditional");
  assert.equal(checkHazmat("1017", list).status, "refused");
  assert.equal(checkHazmat("0012", list).status, "refused"); // class 1 always refused
  assert.equal(checkHazmat("9999", list).status, "unknown");
  assert.equal(checkHazmat("sulph", list).good?.un, "1830");
});
