import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@components/buttons/BackButton";

import { Locale } from "@services/i18n/i18n";

type PageProps = {
  data: MovieData[];
};

type MovieData = {
  title: string;
  category: string;
  "sub-category": string;
  url: string;
  id: string;
  description: string;
  files: string;
  data: {
    type: string;
    version: string;
    provider_name: string;
    provider_url: string;
    title: string;
    author_name: string;
    author_url: string;
    html: string;
    player_url: string;
    thumbnail_url: string;
    thumbnail_width: number;
    thumbnail_height: number;
    thumbnail_url_with_play_button: string;
    upload_date: string;
    uri: string;
    id: string;
    description: string;
  };
};

type CategoriesedData<T, K extends (keyof T)[]> = {
  key: K[0] extends keyof T ? T[K[0]] : never;
  data: K extends [infer _, ...infer Rest]
    ? Rest["length"] extends 0
      ? T[]
      : Rest extends (keyof T)[]
      ? CategoriesedData<T, Rest>[]
      : never
    : never;
};

function categoriseData<T, K extends (keyof T)[]>(
  dataList: T[],
  keyList: [...K],
): CategoriesedData<T, K>[] {
  const removeDuplicate = function <T>(array: T[]) {
    return [...new Set(array)];
  };
  const [key, ...rest] = keyList;
  const categories = removeDuplicate(dataList.map(data => data[key]));
  return categories.map(category => {
    const filteredData = dataList.filter(data => data[key] === category);
    const data = rest.length ? categoriseData(filteredData, rest) : filteredData;
    return {
      key: category,
      data,
    } as CategoriesedData<T, K>;
  });
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  locale = locale as Locale;
  const data =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja.json`)).default
      : (await import(`json_in_repo/movies/en.json`)).default;

  return {
    props: { data },
  };
};

const HeaderBar = () => {
  return (
    <div className="fixed top-0 flex w-full items-center bg-base-100/20 backdrop-blur-lg">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const Card = ({ data: movieData }: { data: MovieData }) => {
  const { title, data } = movieData;
  return (
    <div
      style={{ width: data.thumbnail_width }}
      className="w-[fit-content] rounded-md drop-shadow-md 
      transition hover:opacity-60  hover:drop-shadow-xl"
    >
      <Link href={`./movies/${data.id}`}>
        <Image
          width={data.thumbnail_width}
          height={data.thumbnail_height}
          src={data.thumbnail_url_with_play_button}
          alt={title || data.title}
        />
        <div className="bg-base-200 p-3">{title || data.title}</div>
      </Link>
    </div>
  );
};

const MovieCardList = ({ data }: { data: MovieData[] }) => {
  return (
    <div className="flex flex-row flex-wrap gap-5 pb-8 ">
      {data.map((movieData, i) => {
        return <Card key={i} data={movieData} />;
      })}
    </div>
  );
};

const WholeMovieCardList = ({ data }: { data: MovieData[] }) => {
  const categorisedData = categoriseData(data, ["category", "sub-category"]);
  return (
    <div className="grid gap-14">
      {categorisedData.map((dataList, i) => (
        <div
          key={dataList.key}
          className="rounded-box border-[1px] border-base-300 bg-base-100 p-6"
        >
          <h3 className="my-10 text-2xl text-base-content" id={dataList.key}>
            {dataList.key}
          </h3>
          {dataList.data.map((data, i) => (
            <div key={i}>
              <h4 className="my-5 text-xl text-base-content" id={data.key}>
                {data.key}
              </h4>
              <MovieCardList data={data.data} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Toc = ({ data }: { data: MovieData[] }) => {
  const categorisedData = categoriseData(data, ["category", "sub-category"]);
  return (
    <ul className="flex flex-col gap-2">
      {categorisedData.map((dataList, i) => (
        <li key={i}>
          <Link href={`#${dataList.key}`} className="link-info block">
            {dataList.key}
          </Link>
          <ul className="flex flex-col gap-2">
            {dataList.data.map((data, i) => (
              <li key={i} className="pl-4">
                <Link href={`#${data.key}`} className="link-info block">
                  {data.key}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

type LayoutProps = {
  toc: React.ReactNode;
  main: React.ReactNode;
};

/** Cummulative layout in small screen and show toc in left in large screen */
const Layout = ({ toc, main }: LayoutProps) => {
  return (
    <div className="flex h-full flex-col gap-5 md:flex-row">
      <div className="h-full overflow-y-auto p-8">
        <div className="md:sticky md:top-14 md:block ">
          <div className="">{toc}</div>
        </div>
      </div>
      <div className="h-full w-full scroll-pt-14  overflow-y-auto  p-4 pt-14">
        <div className="mx-auto max-w-6xl pb-16">{main}</div>
      </div>
    </div>
  );
};

const MoviesPage: NextPage<PageProps> = ({ data }: { data: MovieData[] }) => {
  return (
    <div className="h-dvh">
      <Head>
        <title>Movies</title>
      </Head>
      <HeaderBar />
      <div className="h-full">
        <Layout toc={<Toc data={data} />} main={<WholeMovieCardList data={data} />} />
      </div>
    </div>
  );
};

export default MoviesPage;
export { type MovieData };
