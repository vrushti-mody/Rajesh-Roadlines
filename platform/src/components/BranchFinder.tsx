"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type B = { id: string; town: string; region: string; kind: string; phones: string[]; address?: string; aliases: string[] };
const KIND: Record<string, string> = { office: "Branch", "area-office": "Area office", corporate: "Corporate office", doorstep: "Door-step delivery", representative: "Representative" };
const tel = (p: string) => { const d = p.replace(/\D/g, ""); return "+91" + (d.length === 10 && /^[6-9]/.test(d) ? d : d.replace(/^0/, "")); };
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function BranchFinder({ branches, regions }: { branches: B[]; regions: { value: string; label: string }[] }) {
  const t = useTranslations("branches");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const label = Object.fromEntries(regions.map((r) => [r.value, r.label]));
  const list = useMemo(() => {
    const n = norm(q.trim());
    return branches.filter((b) => (region === "all" || b.region === region) &&
      (!n || norm(`${b.town} ${b.address ?? ""} ${b.aliases.join(" ")} ${label[b.region]}`).includes(n)));
  }, [q, region, branches, label]);

  return (
    <div className="stack">
      <div className="card row">
        <div className="field"><label htmlFor="bq">{t("search")}</label><input id="bq" type="search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="field"><label htmlFor="br">Region</label><select id="br" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="all">All ({branches.length})</option>{regions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
      </div>
      <p className="muted" aria-live="polite">{list.length} location{list.length === 1 ? "" : "s"}</p>
      <div className="grid">
        {list.map((b) => (
          <article key={b.id} className="card stack" style={{ gap: 6 }}>
            <p className="muted" style={{ fontSize: 13 }}>{label[b.region]} · {KIND[b.kind] ?? b.kind}</p>
            <h2 style={{ fontSize: 22 }}>{b.town}</h2>
            {b.address ? <p className="muted">{b.address}</p> : null}
            {b.phones.length ? <p>{b.phones.map((p) => <a key={p} href={`tel:${tel(p)}`} style={{ marginRight: 12, fontWeight: 600 }}>{p}</a>)}</p> : <p className="muted">No office here. Book on 022-62284444.</p>}
          </article>
        ))}
        {!list.length ? <p className="card">No office in that town yet. We may still deliver there from a nearby branch: call 022-62284444.</p> : null}
      </div>
    </div>
  );
}
