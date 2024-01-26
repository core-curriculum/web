const locales = ["ja", "en"] as const;
type Locale = (typeof locales)[number];

export type { Locale };
export { locales };
