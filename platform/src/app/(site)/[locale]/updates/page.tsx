import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { getActiveUpdates } from "@/lib/data";

export const revalidate = 120;
const KIND: Record<string, string> = { news: "News", route: "Route alert", monsoon: "Monsoon alert", holiday: "Holiday", service: "Service change" };

export default async function UpdatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("updates");
  const list = await getActiveUpdates(50);
  return (
    <>
      <PageHead title={t("title")} />
      {list.length ? (
        <ul className="list">
          {list.map((u) => (
            <li key={u.id} className={`card ${u.kind !== "news" ? `alert ${u.severity}` : ""}`}>
              <p className="muted" style={{ fontSize: 13 }}>{KIND[u.kind] ?? u.kind} · {new Date(u.startsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</p>
              <h2 style={{ fontSize: 22 }}>{u.title}</h2>
              <p>{u.summary}</p>
            </li>
          ))}
        </ul>
      ) : <p className="card">{t("none")}</p>}
    </>
  );
}
