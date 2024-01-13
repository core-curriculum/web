import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { BackButton } from "@components/buttons/BackButton";
import { type MovieData } from "..";

import { Locale, Locales } from "@services/i18n/i18n";

type PageProps = {
  data: MovieData[];
  category: { category: string; subCategory: string } | { category: string };
};

type PathParams = {
  paths: string[];
};

function extractCategories<T, K extends (keyof T)[]>(
  dataList: T[],
  keyList: [...K],
): T[[...K][number]][][] {
  const removeDuplicate = function <T>(array: T[]) {
    return [...new Set(array)];
  };
  const [key, ...rest] = keyList;
  const categories = removeDuplicate(dataList.map(data => data[key])).map(category => [category]);
  if (!rest.length) return categories;
  const childCategories = categories
    .map(([category]) => {
      const filteredData = dataList.filter(data => data[key] === category);
      return extractCategories(filteredData, rest).map(data => [category, ...data]);
    })
    .flat();
  return [...categories, ...childCategories];
}

const getPaths = async (): Promise<
  {
    params: {
      paths: string[];
    };
    locale: Locale;
  }[]
> => {
  const data = {
    ja: (await import("json_in_repo/movies/ja.json")).default,
    en: (await import("json_in_repo/movies/en.json")).default,
  };
  const paths = (["en", "ja"] as Locales)
    .map(locale =>
      extractCategories(data[locale], ["category", "sub-category"]).map(paths => ({
        params: { paths },
        locale,
      })),
    )
    .flat();
  return paths;
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getPaths();
  console.log(JSON.stringify(paths));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale, params }) => {
  const paths = params?.paths || [];
  if (paths.length === 0) throw new Error("No paths");
  const categoryToMatch: { category: string; subCategory: string } | { category: string } =
    paths.length === 1
      ? { category: paths[0] as string }
      : { category: paths[0] as string, subCategory: paths[1] as string };
  locale = locale as Locale;
  const allData =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja.json`)).default
      : (await import(`json_in_repo/movies/en.json`)).default;
  const data = allData.filter(
    ({ category, "sub-category": subCategory }) =>
      category === categoryToMatch.category &&
      ("subCategory" in categoryToMatch ? subCategory === categoryToMatch.subCategory : true),
  );
  return {
    props: { data, category: categoryToMatch },
  };
};

const MovieListPage: NextPage<PageProps> = ({ data, category }: PageProps) => {
  return <div>{JSON.stringify(category)}</div>;
};

export default MovieListPage;
