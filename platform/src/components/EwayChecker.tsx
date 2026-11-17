"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { checkEwayBill, type EwayInput, type EwayThresholds, type Purpose, type StateCode } from "@/lib/ewaybill";

const STATES: [StateCode, string][] = [["MH", "Maharashtra"], ["GA", "Goa"], ["GJ", "Gujarat"], ["OTHER", "Another state"]];
const PURPOSES: [Purpose, string][] = [["sale", "Sale"], ["branch-transfer", "Branch / stock transfer"], ["job-work", "Job work"], ["return", "Sales return"], ["other", "Other (samples, exhibition…)"]];

export function EwayChecker({ thresholds }: { thresholds: EwayThresholds }) {
  const t = useTranslations("eway");
  const [f, setF] = useState<EwayInput>({ fromState: "MH", toState: "GA", valueInr: 85000, purpose: "sale", distanceKm: 590, notifiedGoods: false, intraCity: false, hazardous: false, b2b: true, supplierAboveEInvoiceLimit: false });
  const set = <K extends keyof EwayInput>(k: K, v: EwayInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => checkEwayBill(f, thresholds), [f, thresholds]);
  const intra = f.fromState === f.toState && f.fromState !== "OTHER";

  return (
    <div className="stack">
      <form className="card stack" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="field"><label htmlFor="fs">From state</label><select id="fs" value={f.fromState} onChange={(e) => set("fromState", e.target.value as StateCode)}>{STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div className="field"><label htmlFor="ts">To state</label><select id="ts" value={f.toState} onChange={(e) => set("toState", e.target.value as StateCode)}>{STATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
          <div className="field"><label htmlFor="val">Consignment value incl. GST (₹)</label><input id="val" type="number" min={0} inputMode="numeric" value={f.valueInr || ""} onChange={(e) => set("valueInr", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="km">Distance (km)</label><input id="km" type="number" min={0} inputMode="numeric" value={f.distanceKm || ""} onChange={(e) => set("distanceKm", Number(e.target.value))} /></div>
          <div className="field"><label htmlFor="pp">Reason for movement</label><select id="pp" value={f.purpose} onChange={(e) => set("purpose", e.target.value as Purpose)}>{PURPOSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        </div>
        <div className="row">
          {intra && (f.fromState === "GA" || f.fromState === "GJ") ? (
            <label><input type="checkbox" checked={!!f.notifiedGoods} onChange={(e) => set("notifiedGoods", e.target.checked)} /> Goods are on {f.fromState === "GA" ? "Goa's notified list" : "Gujarat's specified list"}</label>
          ) : null}
          {intra && f.fromState === "GJ" ? <label><input type="checkbox" checked={!!f.intraCity} onChange={(e) => set("intraCity", e.target.checked)} /> Pickup and delivery in the same city</label> : null}
          <label><input type="checkbox" checked={!!f.hazardous} onChange={(e) => set("hazardous", e.target.checked)} /> Hazardous goods</label>
          <label><input type="checkbox" checked={!!f.overDimensional} onChange={(e) => set("overDimensional", e.target.checked)} /> Over-dimensional cargo</label>
          <label><input type="checkbox" checked={!!f.supplierAboveEInvoiceLimit} onChange={(e) => set("supplierAboveEInvoiceLimit", e.target.checked)} /> Supplier turnover above ₹{thresholds.eInvoiceTurnoverCr} crore</label>
        </div>
      </form>

      <section className="card stack" aria-live="polite">
        <p><span className={`pill ${r.required ? "warn" : "ok"}`}>{r.required ? "E-way bill needed" : "No e-way bill needed"}</span></p>
        <p>{r.reason}{r.validityDays ? ` Valid for ${r.validityDays} day${r.validityDays > 1 ? "s" : ""} for this distance.` : ""}</p>
        {r.warnings.map((w) => <p key={w} className="muted">{w}</p>)}
        <h2>Hand these to the driver</h2>
        <ul className="docs">{r.documents.map((d) => <li key={d}>{d}</li>)}</ul>
        <p className="muted">{t("disclaimer")}</p>
      </section>
    </div>
  );
}
