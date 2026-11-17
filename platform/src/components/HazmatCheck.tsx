"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { checkHazmat, type HazCheck, type HazGood } from "@/lib/hazmat";
import { Link } from "@/i18n/navigation";

const CLASS_NAMES: Record<string, string> = {
  "1": "explosives", "2.1": "flammable gases", "2.3": "toxic gases", "4.3": "dangerous when wet", "5.2": "organic peroxides",
  "6.1": "toxic substances", "6.2": "infectious substances", "7": "radioactive material",
};

export function HazmatCheck({ list, refusedClasses }: { list: HazGood[]; refusedClasses: string[] }) {
  const t = useTranslations("hazmat");
  const [q, setQ] = useState("");
  const [r, setR] = useState<HazCheck | null>(null);
  const tone = { accepted: "ok", conditional: "warn", refused: "bad", unknown: "warn" } as const;
  const label = { accepted: "We carry this", conditional: "We carry this with conditions", refused: "We do not carry this", unknown: "Needs a check" } as const;

  return (
    <div className="stack">
      <form className="card row" onSubmit={(e) => { e.preventDefault(); setR(checkHazmat(q, list, refusedClasses)); }}>
        <div className="field"><label htmlFor="q">{t("ph")}</label><input id="q" value={q} onChange={(e) => setQ(e.target.value)} list="haz-names" /></div>
        <button className="btn btn-ink">{t("go")}</button>
        <datalist id="haz-names">{list.map((g) => <option key={g.un} value={`UN${g.un}`}>{g.name}</option>)}</datalist>
      </form>
      <div aria-live="polite">
        {r ? (
          <section className="card stack">
            <p><span className={`pill ${tone[r.status]}`}>{label[r.status]}</span></p>
            <p>{r.message}</p>
            {r.documents.length ? (<><h2>Before you book</h2><ul className="docs">{r.documents.map((d) => <li key={d}>{d}</li>)}</ul>
              <p><Link className="btn btn-signal" href="/pickup">Request a pickup</Link></p></>) : null}
          </section>
        ) : null}
      </div>
      <p className="muted">Never carried: {refusedClasses.map((c) => `class ${c}${CLASS_NAMES[c] ? " (" + CLASS_NAMES[c] + ")" : ""}`).join(", ")}.</p>
    </div>
  );
}
