"use client";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";

const ITEMS = [
  ["/", "home"], ["/track", "track"], ["/book-by", "bookBy"], ["/e-way-bill", "eway"], ["/hazardous", "hazmat"],
  ["/pickup", "pickup"], ["/load-planner", "planner"], ["/branches", "branches"], ["/updates", "updates"], ["/report", "report"],
] as const;

export function SideNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  return (
    <aside className="side">
      <Link className="brand" href="/">
        <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#0d1b2a" stroke="#2b3f56" /><path d="M14 52 L28 12 H36 L50 52" fill="none" stroke="#f4b400" strokeWidth="5" strokeLinejoin="round" /><path d="M32 18 V26 M32 32 V40 M32 46 V52" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
        RRPL
      </Link>
      <nav aria-label="Shipper tools">
        {ITEMS.map(([href, key]) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{t(key)}</Link>
        ))}
        <a href="https://rajeshrpl.in/">{t("site")} ↗</a>
      </nav>
      <label htmlFor="locale" className="sr-only">Language</label>
      <select id="locale" value={locale} onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}>
        {routing.locales.map((l) => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </aside>
  );
}
