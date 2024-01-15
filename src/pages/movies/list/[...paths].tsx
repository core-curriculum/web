import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import { Locale, Locales } from "@services/i18n/i18n";
import { MovieCardList, MoviePageLayout, type MovieData, MovieToc, categoriseData } from "..";
import { BackButton } from "@components/buttons/BackButton";

type PageProps = {
  data: MovieData[];
  category: { category: string; subCategory: string } | { category: string };
};

type PathParams = {
  paths: string[];
};

const HeaderBar = () => {
  return (
    <div className="bg-base-100/20 fixed top-0 z-10 flex w-full items-center backdrop-blur-lg">
      <div className="ml-2">
        <BackButton href="../" />
      </div>
    </div>
  );
};

function extractCategories<T, K extends (keyof T)[]>(
  dataList: T[],
  keyList: [...K],
): T[[...K][number]][][] {
  const removeDuplicate = function <T>(array: T[]) {
    return [...new Set(array)];
  };
  const [key, ...rest] = keyList;
  const categories = removeDuplicate(dataList.map(data => data[key]))
    .filter(category => category)
    .map(category => [category]);
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

type SubCategoryPageProps = {
  category: { category: string; subCategory: string };
  data: MovieData[];
};

const SubCategoryPage = ({ data, category: { category, subCategory } }: SubCategoryPageProps) => {
  return (
    <div className="h-dvh">
      <HeaderBar />
      <div className="grid scroll-pt-14 gap-4 p-4 pt-14">
        <h1 className="text-xl">{category}</h1>
        <h2 className="text-lg">{subCategory}</h2>
        <MovieCardList data={data} />
      </div>
    </div>
  );
};

const CategoryPane = ({ data, category: { category } }: PageProps) => {
  const subCategories = categoriseData(data, ["sub-category"]);
  return (
    <div className="grid gap-4 p-4">
      <h1 className="text-xl">{category}</h1>
      {subCategories.map(subCategory => (
        <Link
          key={subCategory.key}
          href={`/movies/list/${encodeURIComponent(category)}/${encodeURIComponent(
            subCategory.key,
          )}`}
          className="text-lg"
        >
          {subCategory.key}
          <MovieCardList data={subCategory.data} />
        </Link>
      ))}
    </div>
  );
};

const CategoryPage = (props: PageProps) => {
  return (
    <>
      <HeaderBar />
      <MoviePageLayout toc={<MovieToc data={props.data} />} main={<CategoryPane {...props} />} />
    </>
  );
};
const MovieListPage: NextPage<PageProps> = ({ data, category }: PageProps) => {
  if ("subCategory" in category) {
    return <SubCategoryPage data={data} category={category} />;
  }
  return <CategoryPage data={data} category={category} />;
};

export default MovieListPage;
