import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackButton } from "@components/buttons/BackButton";
import { Locale, Locales, useTranslation } from "@services/i18n/i18n";
import {
  MovieCardList,
  MoviePageLayout,
  MovieToc,
  categoriseData,
  loadMovieData,
  DataList,
  isMovieData,
  CategoryInfo,
} from "..";

type PageProps = {
  data: DataList;
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
  const paths = (
    await Promise.all(
      (["en", "ja"] as Locales).map(async locale => {
        const data = await loadMovieData(locale as Locale);
        return extractCategories(data.filter(isMovieData), ["category", "sub-category"]).map(
          paths => ({
            params: { paths },
            locale,
          }),
        );
      }),
    )
  ).flat();
  return paths;
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getPaths();
  return {
    paths,
    fallback: true,
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
  const allData = await loadMovieData(locale as Locale);
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
  data: DataList;
};

const SubCategoryPage = ({ data, category: { category, subCategory } }: SubCategoryPageProps) => {
  const movieData = data.filter(isMovieData);
  return (
    <div className="h-dvh">
      <HeaderBar />
      <div className="grid scroll-pt-14 gap-4 p-4 pt-14">
        <Link href={`/movies/list/${category}`} className="link link-hover">
          <h1 className="text-xl">{category}</h1>
        </Link>
        <h2 className="text-lg">{subCategory}</h2>
        <CategoryInfo data={data} category={category} subCategory={subCategory} />
        <MovieCardList data={movieData} />
      </div>
    </div>
  );
};

const CategoryPane = ({ data, category: { category } }: PageProps) => {
  const movieData = data.filter(isMovieData);
  const subCategories = categoriseData(movieData, ["sub-category"]);
  return (
    <div className="grid gap-4 p-4">
      <h1 className="text-xl">{category}</h1>
      <CategoryInfo data={data} category={category} subCategory="" />
      {subCategories.map(subCategory => (
        <Link
          key={subCategory.key}
          href={`/movies/list/${encodeURIComponent(category)}/${encodeURIComponent(
            subCategory.key,
          )}`}
          className="text-lg"
        >
          {subCategory.key}
          <CategoryInfo data={data} category={category} subCategory={subCategory.key} />
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

const CannotFindPage = () => {
  const pathname = usePathname();
  const { t } = useTranslation("@pages/movies");
  return (
    <div className="h-dvh">
      <HeaderBar />
      <div className="grid h-full scroll-pt-14 place-items-center gap-4 p-4 pt-14">
        <div className="grid gap-10">
          <h1 className="text-2xl">{t("notFoundTitle")}</h1>
          <p>
            {decodeURIComponent(pathname)} {t("notFound")}
          </p>
          <Link href="/movies" className="link link-info">
            {t("notFoundToBack")}
          </Link>
        </div>
      </div>
    </div>
  );
};

const MovieListPage: NextPage<PageProps> = ({ data, category }: PageProps) => {
  const { t } = useTranslation("@pages/movies");
  console.log(category);
  console.log(data);
  if (!data || data.length === 0) return <CannotFindPage />;
  const pageTitle = "subCategory" in category ? category.subCategory : category.category;
  const movieData = data.filter(isMovieData);
  if (!movieData || movieData.length === 0) return <CannotFindPage />;
  return (
    <>
      <Head>
        <title>
          {pageTitle} | {t("siteTitle")}
        </title>
      </Head>
      {"subCategory" in category ? (
        <SubCategoryPage data={data} category={category} />
      ) : (
        <CategoryPage data={data} category={category} />
      )}
    </>
  );
};

export default MovieListPage;
