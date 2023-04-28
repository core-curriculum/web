import { useRouter } from "next/router";


const origin = typeof window !== "undefined" && window?.location
  ? window?.location?.origin
  : "https://core-curriculum.jp";

const useFullUrl = () => {
  const router = useRouter();
  return origin + router.asPath;
}

const listUrl = (id: string) => {
  return `${origin}/x/${id}`;
};

export { origin, useFullUrl, listUrl }