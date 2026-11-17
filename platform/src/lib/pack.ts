/**
 * Load planner: packs boxes into a truck body and reports what fits.
 *
 * Heuristic: extreme-point placement, front of the body (by the cab) first, floor before stacking.
 * Boxes may turn on the floor (swap length and width) but are never laid on their side.
 * A box is stacked only on a single stackable box whose top fully supports it.
 * Good enough to plan a load and pick a truck size; the loading supervisor has the final say.
 *
 * Units: centimetres and kilograms. Axes: x = along the body from the cab, y = up, z = across.
 */

export interface Item {
  id: string;
  name: string;
  l: number; w: number; h: number; // cm
  kg: number;                      // per piece
  qty: number;
  stackable?: boolean;             // may other boxes sit on it (default true)
}

export interface Truck {
  id: string;
  name: string;
  l: number; w: number; h: number; // inside body, cm
  payloadKg: number;
}

export interface Placement {
  itemId: string;
  index: number; // piece number within the item
  x: number; y: number; z: number;
  l: number; w: number; h: number;
}

export interface PackResult {
  placements: Placement[];
  unplaced: { itemId: string; count: number; reason: "space" | "weight" | "too-big" }[];
  usedKg: number;
  usedVolumePct: number;
  usedWeightPct: number;
  /** Length of floor used from the cab, cm. */
  floorUsed: number;
  fitsAll: boolean;
}

interface Point { x: number; y: number; z: number; support?: Placement }

const EPS = 0.001;

function overlaps(a: Placement, x: number, y: number, z: number, l: number, h: number, w: number): boolean {
  return x < a.x + a.l - EPS && x + l > a.x + EPS &&
         y < a.y + a.h - EPS && y + h > a.y + EPS &&
         z < a.z + a.w - EPS && z + w > a.z + EPS;
}

export function pack(truck: Truck, items: Item[]): PackResult {
  const pieces: { item: Item; index: number }[] = [];
  for (const it of items) {
    const qty = Math.max(0, Math.floor(it.qty));
    for (let i = 0; i < qty; i++) pieces.push({ item: it, index: i });
  }
  // Heaviest and largest first, so they sit low and forward.
  pieces.sort((a, b) => b.item.kg - a.item.kg || b.item.l * b.item.w * b.item.h - a.item.l * a.item.w * a.item.h);

  const stackableById = new Map(items.map((i) => [i.id, i.stackable !== false]));
  const placements: Placement[] = [];
  let points: Point[] = [{ x: 0, y: 0, z: 0 }];
  let usedKg = 0;
  const unplaced = new Map<string, { count: number; reason: "space" | "weight" | "too-big" }>();
  const miss = (id: string, reason: "space" | "weight" | "too-big") => {
    const u = unplaced.get(id);
    if (u) u.count++; else unplaced.set(id, { count: 1, reason });
  };

  for (const { item, index } of pieces) {
    const fitsBody = (item.h <= truck.h) && ((item.l <= truck.l && item.w <= truck.w) || (item.w <= truck.l && item.l <= truck.w));
    if (!fitsBody) { miss(item.id, "too-big"); continue; }
    if (usedKg + item.kg > truck.payloadKg + EPS) { miss(item.id, "weight"); continue; }

    points.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
    let placed: Placement | null = null;
    let usedPoint = -1;

    outer: for (let pi = 0; pi < points.length; pi++) {
      const p = points[pi];
      for (const [l, w] of [[item.l, item.w], [item.w, item.l]] as const) {
        if (p.x + l > truck.l + EPS || p.y + item.h > truck.h + EPS || p.z + w > truck.w + EPS) continue;
        if (p.y > EPS) {
          const s = p.support;
          if (!s || !stackableById.get(s.itemId)) continue;
          if (p.x + l > s.x + s.l + EPS || p.z + w > s.z + s.w + EPS) continue;
        }
        if (placements.some((q) => overlaps(q, p.x, p.y, p.z, l, item.h, w))) continue;
        placed = { itemId: item.id, index, x: p.x, y: p.y, z: p.z, l, w, h: item.h };
        usedPoint = pi;
        break outer;
      }
    }

    if (!placed) { miss(item.id, "space"); continue; }
    placements.push(placed);
    usedKg += item.kg;
    points.splice(usedPoint, 1);
    points.push(
      { x: placed.x + placed.l, y: placed.y, z: placed.z },
      { x: placed.x, y: placed.y, z: placed.z + placed.w },
      { x: placed.x, y: placed.y + placed.h, z: placed.z, support: placed },
    );
    // Drop points now inside a box.
    points = points.filter((pt) => !placements.some((q) => overlaps(q, pt.x, pt.y, pt.z, EPS, EPS, EPS)));
  }

  const vol = truck.l * truck.w * truck.h;
  const usedVol = placements.reduce((s, p) => s + p.l * p.w * p.h, 0);
  return {
    placements,
    unplaced: [...unplaced.entries()].map(([itemId, u]) => ({ itemId, ...u })),
    usedKg,
    usedVolumePct: vol ? Math.round((usedVol / vol) * 1000) / 10 : 0,
    usedWeightPct: truck.payloadKg ? Math.round((usedKg / truck.payloadKg) * 1000) / 10 : 0,
    floorUsed: placements.reduce((m, p) => Math.max(m, p.x + p.l), 0),
    fitsAll: unplaced.size === 0,
  };
}

/** Smallest truck (by body volume, then payload) that takes every piece. */
export function smallestTruck(trucks: Truck[], items: Item[]): { truck: Truck; result: PackResult } | null {
  const sorted = [...trucks].sort((a, b) => a.l * a.w * a.h - b.l * b.w * b.h || a.payloadKg - b.payloadKg);
  for (const t of sorted) {
    const result = pack(t, items);
    if (result.fitsAll) return { truck: t, result };
  }
  return null;
}

export const feetToCm = (ft: number) => Math.round(ft * 30.48);
