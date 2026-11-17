import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "mr", "gu", "hi", "kok"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
export type Locale = (typeof routing.locales)[number];
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", mr: "मराठी", gu: "ગુજરાતી", hi: "हिन्दी", kok: "कोंकणी" };
