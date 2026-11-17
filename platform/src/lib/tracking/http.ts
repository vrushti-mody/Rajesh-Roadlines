import { TrackingUnavailable, type LrStatus, type TrackingAdapter } from "./types";

/**
 * Generic HTTP adapter for RRPL's LR system.
 *
 * TRACKING_URL       URL template, e.g. https://lr.example.in/api/track?branch={branch}&lr={lr}
 * TRACKING_API_KEY   optional; sent as "Authorization: Bearer <key>"
 * TRACKING_FIELD_MAP optional JSON mapping our field -> their field (dot paths allowed), e.g.
 *   {"status":"Status","lrNumber":"LRNO","lrDate":"LRDate","lrType":"LRType",
 *    "partyInvoiceNumber":"PartyInvNo","fromStation":"FromStn","toStation":"ToStn",
 *    "packages":"NoOfPkgs","weightKg":"TotWt","branchAddress":"BranchAddr"}
 *
 * The current rajeshrpl.in tracking page shows exactly these ten fields, so the existing system
 * already returns them; Felnix (or whoever hosts it) can confirm the URL and field names.
 */
const DEFAULT_MAP: Record<keyof Omit<LrStatus, "events">, string> = {
  status: "status", lrNumber: "lrNumber", lrDate: "lrDate", lrType: "lrType",
  partyInvoiceNumber: "partyInvoiceNumber", fromStation: "fromStation", toStation: "toStation",
  packages: "packages", weightKg: "weightKg", branchAddress: "branchAddress", updatedAt: "updatedAt",
};

const pick = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);

export const httpAdapter: TrackingAdapter = {
  async lookup(branch, lr) {
    const tpl = process.env.TRACKING_URL;
    if (!tpl) throw new TrackingUnavailable("TRACKING_URL is not set");
    const map = { ...DEFAULT_MAP, ...(process.env.TRACKING_FIELD_MAP ? JSON.parse(process.env.TRACKING_FIELD_MAP) : {}) };
    const url = tpl.replace("{branch}", encodeURIComponent(branch)).replace("{lr}", encodeURIComponent(lr));

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    let res: Response;
    try {
      res = await fetch(url, {
        signal: ctrl.signal,
        headers: { Accept: "application/json", ...(process.env.TRACKING_API_KEY ? { Authorization: `Bearer ${process.env.TRACKING_API_KEY}` } : {}) },
        cache: "no-store",
      });
    } catch (e) {
      throw new TrackingUnavailable(`LR system did not answer: ${(e as Error).message}`);
    } finally {
      clearTimeout(timer);
    }
    if (res.status === 404) return null;
    if (!res.ok) throw new TrackingUnavailable(`LR system returned ${res.status}`);

    const body = (await res.json()) as unknown;
    const row = Array.isArray(body) ? body[0] : body;
    if (!row) return null;
    const get = (k: keyof typeof map) => pick(row, map[k]);
    const lrNumber = get("lrNumber");
    if (lrNumber == null || lrNumber === "") return null;
    const num = (v: unknown) => (v == null || v === "" ? undefined : Number(v));
    const str = (v: unknown) => (v == null || v === "" ? undefined : String(v));
    return {
      status: str(get("status")) ?? "In transit",
      lrNumber: String(lrNumber),
      lrDate: str(get("lrDate")),
      lrType: str(get("lrType")),
      partyInvoiceNumber: str(get("partyInvoiceNumber")),
      fromStation: str(get("fromStation")),
      toStation: str(get("toStation")),
      packages: num(get("packages")),
      weightKg: num(get("weightKg")),
      branchAddress: str(get("branchAddress")),
      updatedAt: str(get("updatedAt")),
    };
  },
};
