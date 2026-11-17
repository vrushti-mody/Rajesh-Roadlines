import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHead } from "@/components/PageHead";
import { TrackForm } from "@/components/TrackForm";

export default async function TrackPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ lr?: string; branch?: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("track");
  return (<><PageHead title={t("title")} sub={t("sub")} /><TrackForm initialLr={sp.lr ?? ""} initialBranch={sp.branch ?? ""} /></>);
}
