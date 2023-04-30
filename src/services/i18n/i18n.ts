import { useRouter } from "next/router";
import { text } from "./text";
import type { LocaleText } from "./text";

type Locale = "ja" | "en";
type Locales = Locale[];
const locales: Locales = ["ja", "en"];

const useLocale = () => useRouter().locale as Locale;
const useLocaleText = <T extends keyof LocaleText>(path: T) => {
  const locale = useRouter().locale as Locale;
  const pageText = text[path];
  const t = <U extends keyof typeof pageText>(key: U) => {
    const value = pageText[key];
    return value[locale as keyof LocaleText[T][U]];
  };
  return { t };
};

const useSwitchTargetLocale = () => {
  const { locale } = useRouter();
  const switchTargetLocale = locales.filter(l => l !== locale)[0];
  return switchTargetLocale;
};

export { useLocale, useSwitchTargetLocale, useLocaleText };
export type { Locale, Locales };
