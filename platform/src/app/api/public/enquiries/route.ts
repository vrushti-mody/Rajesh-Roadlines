import { z } from "zod";
import { payload } from "@/lib/data";
import { clientIp, json, preflight, rateLimit, reference } from "@/lib/http";
import { verifyTurnstile } from "@/lib/turnstile";
import { alertOps, sendTemplate, toWaNumber } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

const optionalNumber = z.preprocess((v) => (v === "" || v == null ? undefined : Number(v)), z.number().positive().max(1_000_000).optional());

const Enquiry = z.object({
  type: z.enum(["Quote", "Pickup"]),
  name: z.string().trim().min(2).max(80),
  company: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().regex(/^[0-9+ -]{10,15}$/, "Enter a valid mobile number"),
  email: z.union([z.literal(""), z.string().trim().email()]).optional().default(""),
  from: z.string().trim().min(2).max(80),
  to: z.string().trim().min(2).max(80),
  goods: z.string().trim().max(160).optional().default(""),
  weight: optionalNumber,
  packages: optionalNumber,
  date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().default(""),
  hazardous: z.boolean().optional().default(false),
  notes: z.string().trim().max(1500).optional().default(""),
  turnstileToken: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

/** POST /api/public/enquiries  (quote and pickup requests from the website and the platform) */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`enq:${ip}`, 5, 10 * 60_000)) return json(req, { error: "Too many requests. Please call 022-62284444." }, 429);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json(req, { error: "Invalid request." }, 400); }
  const parsed = Enquiry.safeParse(raw);
  if (!parsed.success) {
    return json(req, { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, 422);
  }
  const d = parsed.data;
  if (!(await verifyTurnstile(d.turnstileToken, ip))) return json(req, { error: "Please complete the spam check." }, 400);

  const ref = reference(d.type === "Pickup" ? "PU" : "QT");
  const p = await payload();
  await p.create({
    collection: "enquiries",
    overrideAccess: true,
    data: {
      reference: ref, type: d.type, name: d.name, company: d.company, phone: d.phone, email: d.email || undefined,
      from: d.from, to: d.to, goods: d.goods, weightKg: d.weight, packages: d.packages,
      pickupDate: d.date || undefined, hazardous: d.hazardous, notes: d.notes, status: "new",
      source: req.headers.get("origin") ?? "direct",
    },
  });

  // Notifications must never fail the request.
  const summary = `${ref} ${d.name} ${d.phone}, ${d.from} to ${d.to}${d.hazardous ? ", HAZARDOUS" : ""}`;
  void Promise.allSettled([
    alertOps(d.type === "Pickup" ? "pickup request" : "quote request", summary),
    (async () => { const wa = toWaNumber(d.phone); if (wa) await sendTemplate(wa, "rrpl_request_received", [d.name, d.type.toLowerCase() + " request", ref]); })(),
  ]);

  return json(req, { reference: ref }, 201);
}
