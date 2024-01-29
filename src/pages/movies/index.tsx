import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdFilePresent } from "react-icons/md";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, useTranslation } from "@services/i18n/i18n";

type PageProps = {
  data: MovieData[];
};

type FileInfo = {
  name: string;
  file: string;
  downloadUrl: string;
};

type MovieInfo = {
  type: string;
  version: string;
  provider_name: string;
  provider_url: string;
  title: string;
  author_name: string;
  author_url: string;
  duration: string;
  html: string;
  player_url: string;
  thumbnail_url: string;
  thumbnail_width: string;
  thumbnail_height: string;
  thumbnail_url_with_play_button: string;
  upload_date: string;
  uri: string;
  id: string;
  description: string;
  url: string;
};

type MovieData = {
  title: string;
  category: string;
  "sub-category": string;
  url: string;
  id: string;
  description: string;
  files: string;
  data: MovieInfo;
  filesInfo: FileInfo[];
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

export const loadMovieData = async (locale: Locale): Promise<MovieData[]> => {
  const rawData =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja.json`)).default
      : (await import(`json_in_repo/movies/en.json`)).default;
  const movieInfo =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-movie-info.json`)).default
      : (await import(`json_in_repo/movies/en-movie-info.json`)).default;
  const filesInfo =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-files.json`)).default
      : (await import(`json_in_repo/movies/en-files.json`)).default;
  const data = rawData.map(d => {
    const info = movieInfo.find(({ url }) => url === d.url);
    if (!info) throw new Error("No info");
    d.title = info.title;
    d.description = info.description;
    d.id = info.id;
    const filesInfoList = filesInfo.filter(({ file }) => d.files.split(",").some(f => f === file));
    return { ...d, data: info, filesInfo: filesInfoList };
  });
  return data;
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const data = await loadMovieData(locale as Locale);
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

const formatDuration = (second: number) => {
  const hours = Math.floor(second / 3600).toString();
  const minutes = Math.floor((second % 3600) / 60).toString();
  const seconds = Math.floor(second % 60).toString();
  return `${hours ? `${hours.padStart(2, "0")}:` : ""}${
    minutes ? `${minutes.padStart(2, "0")}:` : ""
  }${seconds.padStart(2, "0")}`;
};

const MovieCard = ({ data: movieData }: { data: MovieData }) => {
  const { title, data, description } = movieData;
  const pathname = usePathname();
  const url = `/movies/view/${data.id}?return_to=${pathname}`;
  const truncate = (text: string, length = 30) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  return (
    <div
      style={{ maxWidth: Number(data.thumbnail_width) * 1.5 }}
      className="row-span-3 grid grid-rows-subgrid overflow-hidden rounded-lg drop-shadow-md
      transition [row-gap:0]  hover:opacity-60 hover:drop-shadow-xl"
    >
      <Link href={url}>
        <Image
          width={Number(data.thumbnail_width) * 1.5}
          height={Number(data.thumbnail_height) * 1.5}
          src={data.thumbnail_url_with_play_button}
          alt={title || data.title}
        />
      </Link>
      <Link className="bg-base-200 block " href={url}>
        <div className="p-3">{title || data.title}</div>
      </Link>
      <Link className="bg-base-200 block " href={url}>
        <div className="px-3 text-right text-xs">{formatDuration(Number(data.duration))}</div>
        <div className="p-3 text-xs">{truncate(description || data.description)}</div>
        {movieData.filesInfo.length ? (
          <div className="flex flex-row-reverse px-3 pb-3">
            <MdFilePresent className="text-base-content text-2xl" />
          </div>
        ) : null}
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
  const { t } = useTranslation("@pages/movies");
  return (
    <div className="h-dvh">
      <Head>
        <title>{t("h1")}</title>
      </Head>
      <HeaderBar />
      <div className="h-full">
        <Layout toc={<MovieToc data={data} />} main={<WholeMovieCardList data={data} />} />
      </div>
    </div>
  );
};

export default MoviesPage;
export type { MovieData, MovieInfo };
export { MovieToc, Layout as MoviePageLayout, categoriseData, MovieCardList };
