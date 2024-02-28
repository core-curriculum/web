import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdFilePresent, MdDownload } from "react-icons/md";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, useTranslation } from "@services/i18n/i18n";

type PageProps = {
  data: DataList;
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
  type: "movieData";
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

type MovieCategoryData = {
  type: "categoryData";
  category: string;
  "sub-category": string;
  description: string;
  files: string;
  filesInfo: FileInfo[];
};

type DataList = ReadonlyArray<MovieData | MovieCategoryData>;

const isMovieData = (data: DataList[number]): data is MovieData => data.type === "movieData";

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

export const loadMovieData = async (locale: Locale): Promise<DataList> => {
  const rawData =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-list.json`)).default
      : (await import(`json_in_repo/movies/en-list.json`)).default;
  const movieInfo =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-movie-info.json`)).default
      : (await import(`json_in_repo/movies/en-movie-info.json`)).default;
  const filesInfo =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-files.json`)).default
      : (await import(`json_in_repo/movies/en-files.json`)).default;
  const data = rawData.map(d => {
    const filesInfoList = filesInfo.filter(({ file }) => d.files.split(",").some(f => f === file));
    if (!d.url) {
      return {
        type: "categoryData" as const,
        ...d,
        filesInfo: filesInfoList,
      } as const satisfies MovieCategoryData;
    }
    const info = movieInfo.find(({ url }) => url === d.url);
    if (!info) throw new Error("No info");
    d.title = info.title;
    d.description = info.description;
    return {
      type: "movieData" as const,
      id: info.id,
      ...d,
      data: info,
      filesInfo: filesInfoList,
    } as const satisfies MovieData;
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

const FileInfoPanel = ({ name, downloadUrl }: { name: string; downloadUrl: string }) => {
  return (
    <div className="text-sm">
      <Link
        href={downloadUrl}
        className="link link-info link-hover"
        target="_blank"
        download={true}
        rel="noopener noreferrer"
      >
        {name}
        <MdDownload className="ml-1 inline-block" />
      </Link>
    </div>
  );
};

const FileList = ({ filesInfo, hasTitle }: { filesInfo: FileInfo[]; hasTitle: boolean }) => {
  const { t } = useTranslation("@pages/movies");
  if (filesInfo.length === 0) return <></>;
  const infoList = [...filesInfo].sort(({ name: name1 }, { name: name2 }) =>
    new Intl.Collator("ja").compare(name1, name2),
  );
  return (
    <div className="flex flex-col gap-4 p-3 text-sm">
      {hasTitle ? <h3 className="text-base-content mt-10 text-xl">{t("filesTitle")}</h3> : null}
      {infoList.map(({ name, downloadUrl }, i) => {
        return <FileInfoPanel key={i} name={name} downloadUrl={downloadUrl} />;
      })}
    </div>
  );
};

type CategoryInfoProps = {
  data: DataList;
  category: string;
  subCategory: string;
};
const CategoryInfo = ({ data, category, subCategory }: CategoryInfoProps) => {
  const categoryData = data.find(
    d => d.type === "categoryData" && d.category === category && d["sub-category"] === subCategory,
  ) as MovieCategoryData;
  if (!categoryData) return null;
  const { description, filesInfo } = categoryData;
  return (
    <div className="flex flex-row gap-3">
      <p>{description}</p>
      <FileList filesInfo={filesInfo} hasTitle={false} />
    </div>
  );
};

const WholeMovieCardList = ({ data }: { data: DataList }) => {
  const movieData = data.filter(d => d.type === "movieData") as MovieData[];
  const categorisedData = categoriseData(movieData, ["category", "sub-category"]);
  return (
    <div className="grid gap-14">
      {categorisedData.map(dataList => (
        <div
          key={dataList.key}
          className="rounded-box border-base-300 bg-base-100 border-[1px] p-6"
        >
          <h3 className="text-base-content my-10 text-2xl" id={dataList.key}>
            <Link
              className="link link-hover"
              href={`/movies/list/${encodeURIComponent(dataList.key)}`}
            >
              {" "}
              {dataList.key}
            </Link>
          </h3>
          <CategoryInfo data={data} category={dataList.key} subCategory="" />
          {dataList.data.map(subData => (
            <div key={subData.key}>
              {subData.key ? (
                <div>
                  <h4 className="text-base-content my-5 text-xl" id={subData.key}>
                    <Link
                      className="link link-hover"
                      href={`/movies/list/${dataList.key}/${subData.key}`}
                    >
                      {subData.key}
                    </Link>
                  </h4>
                  <CategoryInfo data={data} category={dataList.key} subCategory={subData.key} />
                </div>
              ) : null}
              <MovieCardList data={subData.data} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MovieToc = ({ data }: { data: DataList }) => {
  const movieData = data.filter(d => d.type === "movieData") as MovieData[];
  const categorisedData = categoriseData(movieData, ["category", "sub-category"]);
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

const MoviesPage: NextPage<PageProps> = ({ data }: { data: DataList }) => {
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
export type { MovieData, MovieInfo, DataList };
export {
  MovieToc,
  Layout as MoviePageLayout,
  categoriseData,
  MovieCardList,
  isMovieData,
  CategoryInfo,
  FileList,
};
