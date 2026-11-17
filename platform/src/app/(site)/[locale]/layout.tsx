import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Barlow_Condensed, IBM_Plex_Sans, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SideNav } from "@/components/SideNav";
import { ChatWidget } from "@/components/ChatWidget";
import "../globals.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--f-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-body" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--f-deva" });
const guj = Noto_Sans_Gujarati({ subsets: ["gujarati"], weight: ["400", "600"], variable: "--f-guj" });

export const metadata: Metadata = {
  title: { default: "RRPL Shipper Desk", template: "%s · RRPL Shipper Desk" },
  description: "Track LRs, check e-way bills and hazardous goods, plan loads and book pickups with Rajesh Roadlines.",
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${deva.variable} ${guj.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="shell">
            <SideNav />
            <main className="main" id="main"><div className="wrap">{children}</div></main>
          </div>
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
