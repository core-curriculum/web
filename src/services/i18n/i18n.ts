import { useRouter } from "next/router";

type Locale = "ja" | "en";
type Locales = Locale[];

const useLocale = () => useRouter().locale as Locale;

export { useLocale };
export type { Locale, Locales };
