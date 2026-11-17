/**
 * LR tracking. The real data lives in RRPL's existing LR system (the one behind rajeshrpl.in/tracking).
 * Pick an adapter with TRACKING_PROVIDER:
 *   http  - calls RRPL's LR system over HTTP and maps its fields (configure below)
 *   mock  - fixed sample data, for local development only
 */
import { httpAdapter } from "./http";
import { mockAdapter } from "./mock";

export * from "./types";
import type { TrackingAdapter } from "./types";

export function getTrackingAdapter(): TrackingAdapter {
  const provider = process.env.TRACKING_PROVIDER ?? "http";
  if (provider === "mock") {
    if (process.env.NODE_ENV === "production") throw new Error("TRACKING_PROVIDER=mock is not allowed in production");
    return mockAdapter;
  }
  return httpAdapter;
}

