import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
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
    <div className="sticky top-0 flex w-full items-center bg-base-100/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const Card = ({ data }: { data: MovieData["data"] }) => {
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
          alt={data.title}
        />
        <div className="bg-base-200 p-3">{data.title}</div>
      </Link>
    </div>
  );
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

const MovieCardList = ({ data }: { data: MovieData[] }) => {
  return (
    <div className="flex flex-row flex-wrap gap-5 pb-8 ">
      {data.map((movieData, i) => {
        return <Card key={i} data={movieData.data} />;
      })}
    </div>
  );
};

const WholeMovieCardList = ({ data }: { data: MovieData[] }) => {
  const categorisedData = categoriseData(data, ["category", "sub-category"]);
  console.log(categorisedData);
  return categorisedData.map((dataList, i) => (
    <div key={dataList.key} className="rounded-box border-[1px] border-base-300 bg-base-100 p-6">
      <h3 className="my-10 text-2xl text-base-content">{dataList.key}</h3>
      {dataList.data.map((data, i) => (
        <div key={i}>
          <h4 className="my-5 text-xl text-base-content">{data.key}</h4>
          <MovieCardList data={data.data} />
        </div>
      ))}
    </div>
  ));
};
const MoviesPage: NextPage<PageProps> = ({ data }: PageProps) => {
  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>
      <HeaderBar />
      <div className=" mx-auto grid max-w-6xl gap-14 pb-16">
        <WholeMovieCardList data={data} />
      </div>
    </>
  );
};

export default MoviesPage;
export { type MovieData };
