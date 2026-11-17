import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { BranchFinder } from "@/components/BranchFinder";
import { getBranches } from "@/lib/data";
import { REGIONS } from "@/lib/regions";

export const revalidate = 300;

export default async function BranchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("branches");
  return (<><PageHead title={t("title")} /><BranchFinder branches={await getBranches()} regions={REGIONS} /></>);
}
