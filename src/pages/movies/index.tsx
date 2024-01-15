import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  files: string[];
  filesInfo: { url: string; fileName?: string; lastModified: string }[];
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
    <div className="bg-base-100/20 fixed top-0 z-10 flex w-full items-center backdrop-blur-lg">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const MovieCard = ({ data: movieData }: { data: MovieData }) => {
  const { title, data } = movieData;
  const pathname = usePathname();
  const url = `/movies/view/${data.id}?return_to=${pathname}`;
  return (
    <div
      style={{ maxWidth: data.thumbnail_width * 1.5 }}
      className="row-span-2 grid grid-rows-subgrid overflow-hidden rounded-lg drop-shadow-md
      transition [row-gap:0]  hover:opacity-60 hover:drop-shadow-xl"
    >
      <Link href={url}>
        <Image
          width={data.thumbnail_width * 1.5}
          height={data.thumbnail_height * 1.5}
          src={data.thumbnail_url_with_play_button}
          alt={title || data.title}
        />
      </Link>
      <Link href={url} className="bg-base-200 block ">
        <div className="p-3">{title || data.title}</div>
      </Link>
    </div>
  );
};

const MovieCardList = ({ data }: { data: MovieData[] }) => {
  return (
    <div className="grid-cols-auto-fill-60 grid gap-5 pb-8 ">
      {data.map((movieData, i) => {
        return <MovieCard key={i} data={movieData} />;
      })}
    </div>
  );
};

const WholeMovieCardList = ({ data }: { data: MovieData[] }) => {
  const categorisedData = categoriseData(data, ["category", "sub-category"]);
  return (
    <div className="grid gap-14">
      {categorisedData.map(dataList => (
        <div
          key={dataList.key}
          className="rounded-box border-base-300 bg-base-100 border-[1px] p-6"
        >
          <h3 className="text-base-content my-10 text-2xl" id={dataList.key}>
            <Link className="link link-hover" href={`/movies/list/${dataList.key}`}>
              {" "}
              {dataList.key}
            </Link>
          </h3>
          {dataList.data.map(data => (
            <div key={data.key}>
              {data.key ? (
                <h4 className="text-base-content my-5 text-xl" id={data.key}>
                  <Link
                    className="link link-hover"
                    href={`/movies/list/${dataList.key}/${data.key}`}
                  >
                    {data.key}
                  </Link>
                </h4>
              ) : null}
              <MovieCardList data={data.data} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MovieToc = ({ data }: { data: MovieData[] }) => {
  const categorisedData = categoriseData(data, ["category", "sub-category"]);
  return (
    <ul className="flex flex-col gap-2">
      {categorisedData.map((dataList, i) => (
        <li key={i}>
          <Link href={`#${dataList.key}`} className="link-info block">
            {dataList.key}
          </Link>
          <ul className="flex flex-col gap-2">
            {dataList.data.flatMap(data => {
              return data.key
                ? [
                    <li key={data.key} className="pl-4">
                      <Link href={`#${data.key}`} className="link-info block">
                        {data.key}
                      </Link>
                    </li>,
                  ]
                : [];
            })}
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
      <div className="p-8 md:h-full md:overflow-y-auto">
        <div className="md:sticky md:top-14 md:block ">
          <div className="">{toc}</div>
        </div>
      </div>
      <div className="w-full scroll-pt-14 p-4  pt-14  md:h-full md:overflow-y-auto">
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
        <Layout toc={<MovieToc data={data} />} main={<WholeMovieCardList data={data} />} />
      </div>
    </div>
  );
};

export default MoviesPage;
export { type MovieData };
export { MovieToc, Layout as MoviePageLayout, categoriseData, MovieCardList };
