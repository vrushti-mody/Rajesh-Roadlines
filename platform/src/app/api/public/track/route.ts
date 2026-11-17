import { getTrackingAdapter, TrackingUnavailable, LR_PATTERN, BRANCH_PATTERN } from "@/lib/tracking";
import { clientIp, json, preflight, rateLimit } from "@/lib/http";

export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

/** GET /api/public/track?branch=VRN&lr=245831 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lr = (url.searchParams.get("lr") ?? "").trim();
  const branch = (url.searchParams.get("branch") ?? "").trim().toUpperCase();
  if (!LR_PATTERN.test(lr) || !BRANCH_PATTERN.test(branch)) {
    return json(req, { error: "Enter the LR number (and branch code) exactly as printed on the consignment note." }, 400);
  }
  if (!rateLimit(`track:${clientIp(req)}`, 30, 60_000)) {
    return json(req, { error: "Too many lookups. Please wait a minute and try again." }, 429);
  }
  try {
    const status = await getTrackingAdapter().lookup(branch, lr);
    if (!status) return json(req, { error: `We could not find LR ${lr}${branch ? " for branch " + branch : ""}.` }, 404);
    return json(req, status);
  } catch (e) {
    if (e instanceof TrackingUnavailable) {
      console.error("tracking unavailable:", e.message);
      return json(req, { error: "Tracking is not responding right now. Please try again shortly or call 022-62284444." }, 503);
    }
    throw e;
  }
}
