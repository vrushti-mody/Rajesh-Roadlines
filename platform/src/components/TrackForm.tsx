"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { LrStatus } from "@/lib/tracking/types";

const LABELS: [keyof LrStatus, string][] = [
  ["lrNumber", "LR number"], ["lrDate", "LR date"], ["lrType", "LR type"], ["partyInvoiceNumber", "Party invoice no."],
  ["fromStation", "From"], ["toStation", "To"], ["packages", "Packages"], ["weightKg", "Total weight (kg)"], ["branchAddress", "Delivery branch"],
];
const tone = (s: string) => (/deliver/i.test(s) && !/undeliver/i.test(s) ? "ok" : /hold|short|damage|return|undeliver/i.test(s) ? "bad" : "warn");

export function TrackForm({ initialLr = "", initialBranch = "" }: { initialLr?: string; initialBranch?: string }) {
  const t = useTranslations("track");
  const [branch, setBranch] = useState(initialBranch);
  const [lr, setLr] = useState(initialLr);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LrStatus | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!lr.trim()) { setError("Enter the LR number from your consignment note."); return; }
    setBusy(true); setError(null); setData(null);
    try {
      const res = await fetch(`/api/public/track?branch=${encodeURIComponent(branch)}&lr=${encodeURIComponent(lr)}`);
      const j = await res.json();
      if (!res.ok) setError(j.error ?? "We could not find that LR.");
      else setData(j as LrStatus);
    } catch {
      setError("Tracking is not responding. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div className="stack">
      <form className="card row" onSubmit={submit} noValidate>
        <div className="field"><label htmlFor="branch">{t("branch")}</label><input id="branch" value={branch} maxLength={10} onChange={(e) => setBranch(e.target.value.toUpperCase())} /></div>
        <div className="field"><label htmlFor="lr">{t("lr")}</label><input id="lr" value={lr} maxLength={15} inputMode="numeric" required aria-invalid={!!error && !lr} onChange={(e) => setLr(e.target.value)} /></div>
        <button className="btn btn-ink" disabled={busy}>{busy ? t("looking") : t("go")}</button>
      </form>
      <div aria-live="polite">
        {error ? <p className="card status bad">{error}</p> : null}
        {data ? (
          <section className="card stack">
            <p><span className={`pill ${tone(data.status)}`}>{data.status}</span>{data.updatedAt ? <span className="muted"> · updated {data.updatedAt}</span> : null}</p>
            <dl className="kv">
              {LABELS.filter(([k]) => data[k] != null && data[k] !== "").map(([k, label]) => (
                <div key={k}><dt>{label}</dt><dd>{String(data[k])}</dd></div>
              ))}
            </dl>
            {data.events?.length ? (
              <ol className="timeline">
                {data.events.map((ev, i) => <li key={i}><strong>{ev.label}</strong>{ev.place ? `, ${ev.place}` : ""}<div className="muted">{ev.at}</div></li>)}
              </ol>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
