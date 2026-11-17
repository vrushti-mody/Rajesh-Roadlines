"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { formatCountdown, nextBookBy, type Lane } from "@/lib/bookby";

type Region = { value: string; label: string };
type Dest = { town: string; region: string; doorstep: boolean };

const fmtDate = (ymd: string) =>
  new Date(ymd + "T12:00:00+05:30").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" });
const fmtTime = (d: Date) => d.toLocaleString("en-IN", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });

export function BookByClock({ lanes, regions, destinations }: { lanes: (Lane & { verified: boolean })[]; regions: Region[]; destinations: Dest[] }) {
  const t = useTranslations("bookBy");
  const [origin, setOrigin] = useState(regions[0]?.value ?? "mumbai");
  const [dest, setDest] = useState(destinations[0]?.town ?? "");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => { setNow(new Date()); const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  const d = destinations.find((x) => x.town === dest);
  const lane = d ? lanes.find((l) => l.origin === origin && l.destination === d.region) : undefined;
  const result = useMemo(() => (lane && now ? nextBookBy(lane, now, d?.doorstep) : null), [lane, now, d?.doorstep]);

  return (
    <div className="stack">
      <div className="card row">
        <div className="field"><label htmlFor="o">{t("from")}</label>
          <select id="o" value={origin} onChange={(e) => setOrigin(e.target.value)}>{regions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
        <div className="field"><label htmlFor="d">{t("to")}</label>
          <select id="d" value={dest} onChange={(e) => setDest(e.target.value)}>{destinations.map((x) => <option key={x.town} value={x.town}>{x.town}</option>)}</select></div>
      </div>
      {!lane ? (
        <p className="card">No scheduled lane for this pair yet. Call 022-62284444 to book.</p>
      ) : (
        <section className="card stack" aria-live="off">
          <div>
            <div className="big">{result ? formatCountdown(result.msLeft) : "–"}</div>
            <p className="muted">{t("left")}{result?.rolledOver ? " (today's cut-off has passed)" : ""}</p>
          </div>
          <dl className="kv">
            <div><dt>{t("nextDispatch")}</dt><dd>{result ? fmtTime(result.cutoffAt) : "–"}</dd></div>
            <div><dt>{t("arrives")}</dt><dd>{result ? fmtDate(result.deliveryDate) : "–"}{d?.doorstep ? " (door-step)" : ""}</dd></div>
          </dl>
          {!lane.verified ? <p className="muted">{t("indicative")}</p> : null}
        </section>
      )}
    </div>
  );
}
