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

const QandAPage: NextPage<PageProps> = ({ data }: PageProps) => {
  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>
      <HeaderBar />
      <div className="mx-auto flex  max-w-6xl flex-row flex-wrap gap-5 pb-16 ">
        {data.map((movieData, i) => {
          return <Card key={i} data={movieData.data} />;
        })}
      </div>
    </>
  );
};

export default QandAPage;
export { type MovieData };
