import { useRouter } from "next/router";
import { text } from "./text";
import type { LocaleText } from "./text";

type Locale = "ja" | "en";
type Locales = Locale[];
const locales: Locales = ["ja", "en"];
const defaultLocale: Locale = "ja";

const useLocale = () => {
  const routerLocale = useRouter().locale as Locale;
  const locale = locales.includes(routerLocale) ? routerLocale : defaultLocale;
  return { locale };
};
const useLocaleText = <T extends keyof LocaleText>(path: T) => {
  const { locale } = useLocale();
  const pageText = text[path];
  const t = <U extends keyof typeof pageText>(key: U) => {
    const value = pageText[key];
    return value ? value[locale as keyof LocaleText[T][U]] : key;
  };
  return { t };
};
const translationInServer = <T extends keyof LocaleText>(locale: Locale, path: T) => {
  const localeToUse = locales.includes(locale) ? locale : defaultLocale;
  const pageText = text[path];
  const t = <U extends keyof typeof pageText>(key: U) => {
    const value = pageText[key];
    return value ? value[localeToUse as keyof LocaleText[T][U]] : key;
  };
  return { t };
};
const useTranslation = useLocaleText;

const useSwitchTargetLocale = () => {
  const { locale } = useRouter();
  const switchTargetLocale = locales.filter(l => l !== locale)[0];
  return switchTargetLocale;
};

export { useLocale, useSwitchTargetLocale, useLocaleText, useTranslation, translationInServer };
export type { Locale, Locales };
