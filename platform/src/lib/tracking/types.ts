/** Shared tracking types (kept separate to avoid circular imports). */
export interface LrStatus {
  status: string;              // "Booked", "In transit", "At delivery branch", "Delivered", ...
  lrNumber: string;
  lrDate?: string;
  lrType?: string;             // Paid / To pay / TBB
  partyInvoiceNumber?: string;
  fromStation?: string;
  toStation?: string;
  packages?: number;
  weightKg?: number;
  branchAddress?: string;
  updatedAt?: string;
  events?: { at: string; label: string; place?: string }[];
}

export interface TrackingAdapter {
  lookup(branchCode: string, lrNumber: string): Promise<LrStatus | null>;
}

export class TrackingUnavailable extends Error {}

export const LR_PATTERN = /^[0-9A-Za-z/-]{3,15}$/;
export const BRANCH_PATTERN = /^[0-9A-Za-z]{0,10}$/;
