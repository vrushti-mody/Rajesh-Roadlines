import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { LoadPlannerClient } from "./client";
import { getTrucks } from "@/lib/data";

export const revalidate = 300;

export default async function PlannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("planner");
  return (<><PageHead title={t("title")} sub={t("sub")} /><LoadPlannerClient trucks={await getTrucks()} /></>);
}
