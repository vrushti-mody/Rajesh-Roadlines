import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { HazmatCheck } from "@/components/HazmatCheck";
import { getHazmat, getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function HazmatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hazmat");
  const [list, settings] = await Promise.all([getHazmat(), getSettings()]);
  return (<><PageHead title={t("title")} sub={t("sub")} /><HazmatCheck list={list} refusedClasses={settings.refusedClasses} /></>);
}
