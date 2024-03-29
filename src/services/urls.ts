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

const usePathName = () => {
  const router = useRouter();
  return router.pathname;
};

const itemUrlToId = (url: string) => {
  const params = url.replace(`${origin}/x`, "");
  const id = locales.reduce((acc, locale) => {
    return acc.replace(`/${locale}/`, "");
  }, params);
  return id.replaceAll("/", "").trim();
};

const itemIdToUrl = (id: string) => {
  return `${origin}/x/${id}`;
};

const itemIdToUrlToEditFromUrl = (id: string, isMap: boolean | null | undefined) => {
  const params = new URLSearchParams([["from", id]]);
  return `${origin}/${isMap ? "map" : "list"}?${params.toString()}`;
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
  usePathName,
  itemUrlToId,
  isValidItemUrlOrId,
  itemIdToUrl,
  objectiveIdToUrl,
  itemIdToUrlToEditFromUrl,
};
