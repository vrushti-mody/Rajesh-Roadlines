/**
 * E-way bill pre-check for shippers.
 *
 * Rules (CGST Rule 138 and state notifications, as of Nov 2026):
 *  - Inter-state: required when consignment value exceeds ₹50,000.
 *  - Inter-state to or from a job worker: required whatever the value.
 *  - Within Maharashtra: required above ₹1,00,000.
 *  - Within Goa: required only for the state's notified goods (22 items) above ₹50,000.
 *  - Within Gujarat: required only for the state's specified goods above ₹50,000; never within one city.
 *  - Validity: 1 day per 200 km or part of it (normal cargo); 1 day per 20 km for over-dimensional cargo.
 *
 * Thresholds are passed in so staff can change them in the CMS (SiteSettings) when a notification changes.
 * This is guidance for shippers, not tax advice; the page tells them to confirm with their CA.
 */

export type StateCode = "MH" | "GA" | "GJ" | "OTHER";
export type Purpose = "sale" | "job-work" | "branch-transfer" | "return" | "other";

export interface EwayThresholds {
  interState: number;
  intraMH: number;
  intraGA: number;
  intraGJ: number;
  eInvoiceTurnoverCr: number;
}

export const DEFAULT_THRESHOLDS: EwayThresholds = {
  interState: 50_000,
  intraMH: 100_000,
  intraGA: 50_000,
  intraGJ: 50_000,
  eInvoiceTurnoverCr: 5,
};

export interface EwayInput {
  fromState: StateCode;
  toState: StateCode;
  /** Consignment value in rupees, including GST, excluding exempt goods. */
  valueInr: number;
  purpose: Purpose;
  /** Goods are on Goa's notified list or Gujarat's specified list (only matters within those states). */
  notifiedGoods?: boolean;
  /** Pickup and delivery in the same city (only matters within Gujarat). */
  intraCity?: boolean;
  distanceKm?: number;
  overDimensional?: boolean;
  hazardous?: boolean;
  /** Supplier's aggregate turnover exceeds the e-invoicing limit. */
  supplierAboveEInvoiceLimit?: boolean;
  /** B2B supply (both parties GST-registered). */
  b2b?: boolean;
}

export interface EwayResult {
  required: boolean;
  reason: string;
  validityDays: number | null;
  documents: string[];
  warnings: string[];
}

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function validityDays(distanceKm: number, overDimensional = false): number {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 1;
  const perDay = overDimensional ? 20 : 200;
  return Math.ceil(distanceKm / perDay);
}

export function checkEwayBill(input: EwayInput, t: EwayThresholds = DEFAULT_THRESHOLDS): EwayResult {
  const value = Math.max(0, Number(input.valueInr) || 0);
  const inter = input.fromState !== input.toState || input.fromState === "OTHER";
  const warnings: string[] = [];
  let required = false;
  let reason = "";

  if (inter) {
    if (input.purpose === "job-work") {
      required = true;
      reason = "Inter-state movement to or from a job worker needs an e-way bill whatever the value.";
    } else if (value > t.interState) {
      required = true;
      reason = `Inter-state consignment above ${inr(t.interState)}.`;
    } else {
      reason = `Inter-state consignment of ${inr(value)} is within the ${inr(t.interState)} limit.`;
    }
  } else {
    switch (input.fromState) {
      case "MH":
        required = value > t.intraMH;
        reason = required
          ? `Within Maharashtra, consignments above ${inr(t.intraMH)} need an e-way bill.`
          : `Within Maharashtra, the limit is ${inr(t.intraMH)}.`;
        break;
      case "GA":
        required = !!input.notifiedGoods && value > t.intraGA;
        reason = required
          ? `Within Goa, notified goods above ${inr(t.intraGA)} need an e-way bill.`
          : input.notifiedGoods
            ? `Within Goa, notified goods need one only above ${inr(t.intraGA)}.`
            : "Within Goa, an e-way bill is needed only for the state's notified goods.";
        break;
      case "GJ":
        if (input.intraCity) {
          reason = "No e-way bill is needed for movement within one city in Gujarat.";
        } else {
          required = !!input.notifiedGoods && value > t.intraGJ;
          reason = required
            ? `Within Gujarat, specified goods above ${inr(t.intraGJ)} need an e-way bill.`
            : "Within Gujarat, an e-way bill is needed only for the state's specified goods above " + inr(t.intraGJ) + ".";
        }
        break;
      default:
        required = value > t.interState;
        reason = required ? `Consignment above ${inr(t.interState)}.` : `Consignment within ${inr(t.interState)}.`;
    }
  }

  const documents: string[] = [];
  if (input.purpose === "sale") documents.push("Tax invoice");
  else if (input.purpose === "return") documents.push("Credit note or delivery challan for the return");
  else documents.push("Delivery challan (no sale)");
  if (required) {
    documents.push("E-way bill: Part A filled by the consignor before pickup");
    documents.push("E-way bill: Part B (vehicle number) updated at loading by RRPL");
  }
  if (input.supplierAboveEInvoiceLimit && input.b2b && input.purpose === "sale") {
    documents.push(`E-invoice with IRN and QR code (supplier turnover above ₹${t.eInvoiceTurnoverCr} crore)`);
  }
  documents.push("GSTIN of consignor and consignee on every document");
  if (input.hazardous) {
    documents.push("Material Safety Data Sheet (MSDS), 16 sections");
    documents.push("TREM card (Transport Emergency card) for each product");
    documents.push("Class label and UN number on every package");
  }

  if (value === 0) warnings.push("Enter the consignment value including GST.");
  if (required && !input.distanceKm) warnings.push("Enter the distance to see how long the e-way bill stays valid.");
  if (input.purpose === "job-work" && inter) warnings.push("Either the principal or the registered job worker may generate it.");

  return {
    required,
    reason,
    validityDays: required ? validityDays(input.distanceKm ?? 0, input.overDimensional) : null,
    documents,
    warnings,
  };
}
