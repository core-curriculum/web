import { useRouter } from "next/router";

type Locale = "ja" | "en";
type Locales = Locale[];
const locales: Locales = ["ja", "en"];

const useLocale = () => useRouter().locale as Locale;
const useSwitchTargetLocale = () => {
  const { locale } = useRouter();
  const switchTargetLocale = locales.filter(l => l !== locale)[0];
  return switchTargetLocale;
};

export { useLocale, useSwitchTargetLocale };
export type { Locale, Locales };
