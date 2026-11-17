import type { TrackingAdapter } from "./types";

/** Development-only sample. getTrackingAdapter() refuses it in production. */
export const mockAdapter: TrackingAdapter = {
  async lookup(_branch, lr) {
    if (lr !== "245831") return null;
    return {
      status: "At delivery branch",
      lrNumber: "245831",
      lrDate: "2026-11-16",
      lrType: "To pay",
      partyInvoiceNumber: "INV/2526/0412",
      fromStation: "Bhiwandi",
      toStation: "Verna",
      packages: 24,
      weightKg: 1180,
      branchAddress: "Rajesh House, Plot SC 1/45, Phase I, Verna Industrial Estate 403722",
      updatedAt: "2026-11-17 07:40",
      events: [
        { at: "2026-11-16 15:10", label: "Booked", place: "Bhiwandi" },
        { at: "2026-11-16 21:30", label: "Dispatched", place: "Bhiwandi" },
        { at: "2026-11-17 07:40", label: "Arrived at delivery branch", place: "Verna" },
      ],
    };
  },
};
