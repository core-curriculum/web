import { useRouter } from "next/router";

type Locale = "ja" | "en";

const useLocale = () => useRouter().locale as Locale;

export { useLocale };
export type { Locale };
