import { useRouter } from "next/router";
import { isValidShortId } from "@libs/uuid_translator";
import { locales } from "./i18n/i18n";

const origin =
  typeof window !== "undefined" && window?.location
    ? window?.location?.origin
    : "https://core-curriculum.jp";

const useFullUrl = () => {
  const router = useRouter();
  return origin + router.asPath;
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

export { origin, useFullUrl, itemUrlToId, isValidItemUrlOrId, itemIdToUrl, objectiveIdToUrl };
