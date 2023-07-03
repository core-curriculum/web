import { useRouter } from "next/router";
import { isValidShortId } from "@libs/uuid_translator";
import { Locale, locales } from "./i18n/i18n";

const origin =
  typeof window !== "undefined" && window?.location
    ? window?.location?.origin
    : "https://core-curriculum.jp";

const useFullUrl = () => {
  const router = useRouter();
  return origin + router.asPath;
};

const qAndAUrl = (locale: Locale) => {
  // eslint-disable-next-line max-len
  return "https://docs.google.com/spreadsheets/d/1xGi_y12VTi2KxLwqqq7ad7mDljNRAfKXI-JkGl0K04Y/export?format=csv&gid=0";
};
const itemUrlToId = (url: string) => {
  const params = url.replace(`${origin}/x/`, "");
  const id = locales.reduce((acc, locale) => {
    return acc.replace(`${locale}`, "");
  }, params);
  return id.replaceAll("/", "").trim();
};

const itemIdToUrl = (id: string) => {
  return `${origin}/x/${id}`;
};

const objectiveIdToUrl = (id: string) => {
  return `${origin}/#${id}`;
};

const isValidItemUrlOrId = (urlOrId: string) => {
  const id = itemUrlToId(urlOrId);
  return isValidShortId(id);
};

export {
  origin,
  useFullUrl,
  itemUrlToId,
  isValidItemUrlOrId,
  itemIdToUrl,
  objectiveIdToUrl,
  qAndAUrl,
};
