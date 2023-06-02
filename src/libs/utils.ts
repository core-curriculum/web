const defaultOption = { l: "{", r: "}" } as const;
type Option = Partial<typeof defaultOption>;

const fmt = (text: String, dict: { [key: string]: string }, option: Option = defaultOption) => {
  const escapeRegExp = (str: string) => str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, "\\$&");
  const opt = option ? { ...option, ...defaultOption } : defaultOption;
  const [l, r] = [opt.l, opt.r].map(text => escapeRegExp(text));
  const key = `${l}(${Object.keys(dict)
    .map(key => escapeRegExp(key))
    .join("|")})${r}`;
  return text.replace(new RegExp(key, "g"), (_, match) => {
    return match in dict ? dict[match] : match;
  });
};

const formatDateTimeIntl = (() => {
  const formatters = new Map<string, { format: (date: Date) => string }>();

  return (date: Date, locale = "default") => {
    const formatter =
      formatters.get(locale) ??
      new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "medium" });
    formatters.set(locale, formatter);
    return formatter.format(date);
  };
})();

const copyToClip = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const objectEquals = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  if (a === b) return true;

  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  if (aKeys.toString() !== bKeys.toString()) return false;
  return aKeys.findIndex(value => a[value] !== b[value]) === -1;
};

const arrayEquals = (a: ReadonlyArray<unknown>, b: ReadonlyArray<unknown>) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.findIndex((_, i) => a[i] !== b[i]) === -1;
};

export { fmt, copyToClip, objectEquals, arrayEquals, formatDateTimeIntl };
