import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { ReportForm } from "@/components/ReportForm";

export default async function ReportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("report");
  return (<><PageHead title={t("title")} sub={t("sub")} /><ReportForm /></>);
}
