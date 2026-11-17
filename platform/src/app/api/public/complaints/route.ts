import { payload } from "@/lib/data";
import { clientIp, json, preflight, rateLimit, reference } from "@/lib/http";
import { verifyTurnstile } from "@/lib/turnstile";
import { alertOps } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

const ISSUES = ["damaged", "short", "delay", "wrong", "billing", "other"] as const;
const MAX_FILES = 5;
const MAX_BYTES = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

/** POST /api/public/complaints  multipart/form-data with up to 5 photos in "photos" */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`cmp:${ip}`, 5, 30 * 60_000)) return json(req, { error: "Too many reports. Please call 022-62284444." }, 429);

  let form: FormData;
  try { form = await req.formData(); } catch { return json(req, { error: "Invalid request." }, 400); }
  const s = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  if (s("website", 10)) return json(req, { reference: "OK" }, 201); // honeypot

  const lrNumber = s("lrNumber", 20), issue = s("issue", 20), description = s("description", 2000);
  const name = s("name", 80), phone = s("phone", 15), email = s("email", 120);
  const errors: Record<string, string> = {};
  if (!/^[0-9A-Za-z/-]{3,15}$/.test(lrNumber)) errors.lrNumber = "Enter the LR number";
  if (!(ISSUES as readonly string[]).includes(issue)) errors.issue = "Choose what went wrong";
  if (description.length < 10) errors.description = "Tell us a little more (at least 10 characters)";
  if (name.length < 2) errors.name = "Enter your name";
  if (!/^[0-9+ -]{10,15}$/.test(phone)) errors.phone = "Enter a valid mobile number";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Check the email address";

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) errors.photos = `Attach up to ${MAX_FILES} files`;
  for (const f of files) {
    if (f.size > MAX_BYTES) errors.photos = "Each file must be under 8 MB";
    if (!TYPES.includes(f.type)) errors.photos = "Photos (JPG, PNG, WebP, HEIC) or PDF only";
  }
  if (Object.keys(errors).length) return json(req, { error: "Please check the highlighted fields.", fields: errors }, 422);
  if (!(await verifyTurnstile(String(form.get("turnstileToken") ?? ""), ip))) return json(req, { error: "Please complete the spam check." }, 400);

  const ref = reference("CP");
  const p = await payload();
  const photoIds: (string | number)[] = [];
  for (const f of files) {
    const doc = await p.create({
      collection: "complaint-files",
      overrideAccess: true,
      data: { note: `${ref} ${f.name}` },
      file: { data: Buffer.from(await f.arrayBuffer()), mimetype: f.type, name: `${ref}-${f.name}`.replace(/[^\w.-]/g, "_"), size: f.size },
    });
    photoIds.push(doc.id);
  }
  await p.create({
    collection: "complaints",
    overrideAccess: true,
    data: { reference: ref, lrNumber, issue: issue as (typeof ISSUES)[number], description, name, phone, email: email || undefined, photos: photoIds as number[], status: "new" },
  });

  void alertOps("problem report", `${ref} LR ${lrNumber}: ${issue}, ${name} ${phone}`).catch(() => {});
  return json(req, { reference: ref }, 201);
}
