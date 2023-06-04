import { useRouter } from "next/router";
import { isValidShortId } from "@libs/uuid_translator";

const origin =
  typeof window !== "undefined" && window?.location
    ? window?.location?.origin
    : "https://core-curriculum.jp";

const useFullUrl = () => {
  const router = useRouter();
  return origin + router.asPath;
};

const listUrl = (id: string) => {
  return `${origin}/x/${id}`;
};

const itemUrlToId = (url: string) => {
  const id = url.replace(`${origin}/x/`, "").replaceAll("/", "").trim();
  return id;
};

const isValidItemUrlOrId = (urlOrId: string) => {
  const id = itemUrlToId(urlOrId);
  return isValidShortId(id);
};

export { origin, useFullUrl, listUrl, itemUrlToId, isValidItemUrlOrId };
