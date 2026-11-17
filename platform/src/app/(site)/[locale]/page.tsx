import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getActiveUpdates } from "@/lib/data";
import { PageHead } from "@/components/PageHead";
import { TrackForm } from "@/components/TrackForm";

export const revalidate = 300;

const TOOLS = [
  ["/book-by", "bookBy", "A live clock to tonight's cut-off and the expected delivery day."],
  ["/e-way-bill", "eway", "Does this load need an e-way bill, and which papers go with the driver?"],
  ["/hazardous", "hazmat", "Check a UN number against what we carry, before you book."],
  ["/pickup", "pickup", "Send a pickup or rate request straight to our operations desk."],
  ["/load-planner", "planner", "See your packages loaded in 3D and the smallest truck that fits."],
  ["/report", "report", "Damage, shortage or delay: report it with photos."],
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const updates = await getActiveUpdates(8);
  const alerts = updates.filter((u) => u.kind !== "news");
  const news = updates.filter((u) => u.kind === "news").slice(0, 3);

  return (
    <div className="stack" style={{ gap: 32 }}>
      <PageHead title={t("home.title")} sub={t("home.sub")} />
      {alerts.length ? (
        <section className="stack" aria-labelledby="alerts">
          <h2 id="alerts">{t("home.alerts")}</h2>
          {alerts.map((a) => (
            <article key={a.id} className={`card alert ${a.severity}`}>
              <strong>{a.title}</strong>
              <p className="muted">{a.summary}</p>
            </article>
          ))}
        </section>
      ) : null}
      <section aria-labelledby="tr"><h2 id="tr" style={{ marginBottom: 12 }}>{t("track.title")}</h2><TrackForm /></section>
      <section className="grid" aria-label="Tools">
        {TOOLS.map(([href, key, text]) => (
          <Link key={href} href={href} className="card tile"><h2 style={{ fontSize: 22 }}>{t(`nav.${key}`)}</h2><p>{text}</p></Link>
        ))}
      </section>
      {news.length ? (
        <section className="stack" aria-labelledby="news">
          <h2 id="news">{t("home.news")}</h2>
          <ul className="list">{news.map((n) => <li key={n.id} className="card"><strong>{n.title}</strong><p className="muted">{n.summary}</p></li>)}</ul>
        </section>
      ) : null}
    </div>
  );
}
