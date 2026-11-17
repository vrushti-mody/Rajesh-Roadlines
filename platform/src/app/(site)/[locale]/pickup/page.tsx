import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getBranches } from "@/lib/data";

export const revalidate = 300;

export default async function PickupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pickup");
  const towns = [...new Set((await getBranches()).filter((b) => b.kind !== "corporate").map((b) => b.town.replace(/ \(.*\)$/, "")))];
  return (<><PageHead title={t("title")} sub={t("sub")} /><EnquiryForm towns={towns} /></>);
}
