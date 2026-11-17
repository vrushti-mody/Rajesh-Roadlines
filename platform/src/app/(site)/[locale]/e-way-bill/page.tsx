import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { EwayChecker } from "@/components/EwayChecker";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export default async function EwayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("eway");
  const { eway } = await getSettings();
  return (<><PageHead title={t("title")} sub={t("sub")} /><EwayChecker thresholds={eway} /></>);
}
