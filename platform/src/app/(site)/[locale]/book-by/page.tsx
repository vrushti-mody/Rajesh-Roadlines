import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { BookByClock } from "@/components/BookByClock";
import { getBranches, getLanes } from "@/lib/data";
import { REGIONS } from "@/lib/regions";

export const revalidate = 300;

export default async function BookByPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bookBy");
  const [lanes, branches] = await Promise.all([getLanes(), getBranches()]);
  const destinations = branches.filter((b) => b.kind !== "corporate").map((b) => ({ town: b.town, region: b.region, doorstep: b.kind === "doorstep" }));
  return (<><PageHead title={t("title")} sub={t("sub")} /><BookByClock lanes={lanes} regions={REGIONS} destinations={destinations} /></>);
}
