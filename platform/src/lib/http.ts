/** Small helpers shared by the public API routes: CORS, rate limiting, client IP, references. */
import { NextResponse } from "next/server";

const allowed = () =>
  (process.env.ALLOWED_ORIGINS ?? "https://rajeshrpl.in,https://www.rajeshrpl.in").split(",").map((s) => s.trim()).filter(Boolean);

export function corsHeaders(origin: string | null): Record<string, string> {
  const ok = origin && allowed().includes(origin);
  return ok
    ? { "Access-Control-Allow-Origin": origin!, "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" }
    : { Vary: "Origin" };
}

export function json(req: Request, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req.headers.get("origin")) });
}

export function preflight(req: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/**
 * Fixed-window limiter kept in memory. Fine for a single instance; when running more than one
 * instance, swap the Map for Redis (e.g. Upstash) with the same interface.
 */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 10_000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.count++;
  return b.count <= limit;
}

/** Human-friendly reference like "PU-261117-4K7Q". */
export function reference(prefix: string): string {
  const d = new Date(Date.now() + 330 * 60_000).toISOString().slice(2, 10).replace(/-/g, "");
  const r = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => "23456789ABCDEFGHJKMNPQRSTUVWXYZ"[b % 31]).join("");
  return `${prefix}-${d}-${r}`;
}
