"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ISSUES = [["damaged", "Damaged goods"], ["short", "Short delivery"], ["delay", "Delayed"], ["wrong", "Wrong delivery"], ["billing", "Billing"], ["other", "Other"]];

export function ReportForm() {
  const t = useTranslations("report");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, 5));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photos");
    files.forEach((f) => fd.append("photos", f));
    setBusy(true); setError(null); setFields({});
    try {
      const res = await fetch("/api/public/complaints", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) { setError(j.error ?? "Please check the form."); setFields(j.fields ?? {}); return; }
      setDone(t("sent", { ref: j.reference, phone: String(fd.get("phone")) }));
    } catch { setError("Could not send. Please call 022-62284444."); } finally { setBusy(false); }
  }

  if (done) return <p className="card status ok" role="status">{done}</p>;
  const e = (k: string) => (fields[k] ? <span className="err">{fields[k]}</span> : null);
  return (
    <form className="card stack" onSubmit={submit} noValidate>
      <div className="row">
        <div className="field"><label htmlFor="lrNumber">LR number *</label><input id="lrNumber" name="lrNumber" required aria-invalid={!!fields.lrNumber} />{e("lrNumber")}</div>
        <div className="field"><label htmlFor="issue">What went wrong *</label><select id="issue" name="issue" required defaultValue="">
          <option value="" disabled>Choose…</option>{ISSUES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>{e("issue")}</div>
      </div>
      <div className="field"><label htmlFor="description">Tell us what happened *</label><textarea id="description" name="description" rows={4} maxLength={2000} required aria-invalid={!!fields.description} />{e("description")}</div>
      <div className="field">
        <label htmlFor="photos">Photos (up to 5, 8 MB each)</label>
        <input id="photos" name="photos" type="file" accept="image/*,application/pdf" multiple capture="environment" onChange={(ev) => addFiles(ev.target.files)} />
        {files.length ? <ul className="docs">{files.map((f, i) => <li key={i}>{f.name} ({Math.round(f.size / 1024)} KB) <button type="button" className="btn btn-line" style={{ minHeight: 28, padding: "0 8px" }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>Remove</button></li>)}</ul> : null}
        {e("photos")}
      </div>
      <div className="row">
        <div className="field"><label htmlFor="name">Your name *</label><input id="name" name="name" required autoComplete="name" />{e("name")}</div>
        <div className="field"><label htmlFor="phone">Mobile *</label><input id="phone" name="phone" type="tel" required autoComplete="tel" />{e("phone")}</div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" />{e("email")}</div>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
      {error ? <p className="status bad" role="alert">{error}</p> : null}
      <div><button className="btn btn-signal" disabled={busy}>{busy ? "Sending…" : t("send")}</button></div>
    </form>
  );
}
