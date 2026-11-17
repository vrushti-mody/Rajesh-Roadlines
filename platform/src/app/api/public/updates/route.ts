import { getActiveUpdates } from "@/lib/data";
import { json, preflight } from "@/lib/http";

export const revalidate = 300;
export const OPTIONS = preflight;

/** GET /api/public/updates  current news and route/monsoon alerts, for the one-page website */
export async function GET(req: Request) {
  return json(req, { updates: await getActiveUpdates(20) });
}
