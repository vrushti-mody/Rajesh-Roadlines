"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Errors = Record<string, string[] | undefined>;

/** Defined outside the form so inputs keep their values when errors re-render the form. */
function F({ name, label, type = "text", required = false, error, ...rest }: { name: string; label: string; type?: string; required?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}{required ? " *" : ""}</label>
      <input id={name} name={name} type={type} required={required} aria-invalid={!!error} aria-describedby={error ? `${name}-e` : undefined} {...rest} />
      {error ? <span className="err" id={`${name}-e`}>{error}</span> : null}
    </div>
  );
}

export function EnquiryForm({ towns }: { towns: string[] }) {
  const t = useTranslations("pickup");
  const [type, setType] = useState<"Quote" | "Pickup">("Pickup");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Errors>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = { ...Object.fromEntries(fd.entries()), type, hazardous: fd.get("hazardous") === "on" };
    setBusy(true); setError(null); setFields({});
    try {
      const res = await fetch("/api/public/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await res.json();
      if (!res.ok) { setError(j.error ?? "Please check the form."); setFields(j.fields ?? {}); return; }
      setDone(t("sent", { ref: j.reference, phone: String(body.phone) }));
      form.reset();
    } catch { setError("Could not send. Please call 022-62284444."); } finally { setBusy(false); }
  }

  const err = (k: string) => fields[k]?.[0];

  if (done) return <p className="card status ok" role="status">{done}</p>;
  return (
    <form className="card stack" onSubmit={submit} noValidate>
      <fieldset className="row" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="sr-only">Request type</legend>
        {(["Pickup", "Quote"] as const).map((v) => (
          <label key={v}><input type="radio" name="kind" checked={type === v} onChange={() => setType(v)} /> {v === "Pickup" ? "Pickup request" : "Rate / quote"}</label>
        ))}
      </fieldset>
      <div className="row"><F error={err("name")} name="name" label="Your name" required autoComplete="name" /><F error={err("company")} name="company" label="Company" autoComplete="organization" /></div>
      <div className="row"><F error={err("phone")} name="phone" label="Mobile" type="tel" required autoComplete="tel" inputMode="tel" /><F error={err("email")} name="email" label="Email" type="email" autoComplete="email" /></div>
      <div className="row"><F error={err("from")} name="from" label="Pickup town" required list="towns" /><F error={err("to")} name="to" label="Delivery town" required list="towns" /></div>
      <div className="row"><F error={err("goods")} name="goods" label="Goods" placeholder="e.g. paint in drums" /><F error={err("weight")} name="weight" label="Weight (kg)" type="number" min={1} /><F error={err("packages")} name="packages" label="Packages" type="number" min={1} />
        {type === "Pickup" ? <F error={err("date")} name="date" label="Pickup date" type="date" min={new Date().toISOString().slice(0, 10)} /> : null}</div>
      <label><input type="checkbox" name="hazardous" /> Hazardous goods (keep the MSDS ready)</label>
      <div className="field"><label htmlFor="notes">Anything else</label><textarea id="notes" name="notes" rows={3} maxLength={1500} /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      <datalist id="towns">{towns.map((x) => <option key={x} value={x} />)}</datalist>
      {error ? <p className="status bad" role="alert">{error}</p> : null}
      <div><button className="btn btn-signal" disabled={busy}>{busy ? "Sending…" : t("send")}</button></div>
    </form>
  );
}
