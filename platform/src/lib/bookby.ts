/**
 * Book-by countdown: when must a shipper book for tonight's dispatch, and when will it arrive?
 *
 * All times are India Standard Time (UTC+05:30, no daylight saving). We represent an IST wall-clock
 * time as a Date whose UTC fields equal the IST fields ("IST-shifted"), so no timezone library is needed
 * and results are the same on any server or browser.
 */

export const IST_OFFSET_MIN = 330;

export interface Lane {
  origin: string;        // region id, e.g. "mumbai"
  destination: string;   // region id
  cutoff: string;        // "HH:MM" IST at the origin hub
  transitDays: number;   // working days after dispatch
  /** 0 = Sunday ... 6 = Saturday. Days with no dispatch and no delivery. */
  closedDays: number[];
  /** Extra days for door-step towns without an office. */
  doorstepExtraDays?: number;
}

export interface BookByResult {
  /** Real instant of the next cut-off. */
  cutoffAt: Date;
  /** Milliseconds from now until the cut-off. */
  msLeft: number;
  /** Delivery date in IST as YYYY-MM-DD. */
  deliveryDate: string;
  /** True when today's cut-off has already passed or today is closed. */
  rolledOver: boolean;
}

const toIst = (d: Date) => new Date(d.getTime() + IST_OFFSET_MIN * 60_000);
const fromIst = (d: Date) => new Date(d.getTime() - IST_OFFSET_MIN * 60_000);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

function parseCutoff(cutoff: string): [number, number] {
  const m = /^(\d{1,2}):(\d{2})$/.exec(cutoff.trim());
  if (!m) throw new Error(`Bad cut-off "${cutoff}", expected HH:MM`);
  const h = Number(m[1]), min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Bad cut-off "${cutoff}"`);
  return [h, min];
}

function addOpenDays(istDay: Date, days: number, closed: number[]): Date {
  const d = new Date(istDay);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (!closed.includes(d.getUTCDay())) left--;
  }
  return d;
}

export function nextBookBy(lane: Lane, now: Date = new Date(), doorstep = false): BookByResult {
  const [h, m] = parseCutoff(lane.cutoff);
  const closed = lane.closedDays ?? [0];
  if (closed.length >= 7) throw new Error("Lane is closed every day");

  const ist = toIst(now);
  const day = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), h, m, 0, 0));
  let rolledOver = false;
  while (closed.includes(day.getUTCDay()) || day.getTime() <= ist.getTime()) {
    day.setUTCDate(day.getUTCDate() + 1);
    rolledOver = true;
  }
  const extra = doorstep ? lane.doorstepExtraDays ?? 1 : 0;
  const delivery = addOpenDays(day, Math.max(0, lane.transitDays) + extra, closed);
  const cutoffAt = fromIst(day);
  return { cutoffAt, msLeft: cutoffAt.getTime() - now.getTime(), deliveryDate: ymd(delivery), rolledOver };
}

export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
}
