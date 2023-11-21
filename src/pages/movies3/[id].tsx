import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, Locales } from "@services/i18n/i18n";
import { MovieData } from ".";

type PageProps = {
  data: MovieData[];
  id: string;
};

type PathParams = {
  id: string;
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const data = {
    ja: (await import("json_in_repo/movies/ja.json")).default,
    en: (await import("json_in_repo/movies/en.json")).default,
  };
  const paths = (["en", "ja"] as Locales)
    .map(locale => data[locale].map(({ id }) => ({ params: { id }, locale })))
    .flat();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale, params }) => {
  const id = (params?.id as string) || "";
  locale = locale as Locale;
  const data =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja.json`)).default
      : (await import(`json_in_repo/movies/en.json`)).default;

  return {
    props: { data, id },
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
      <Image
        width={data.thumbnail_width}
        height={data.thumbnail_height}
        src={data.thumbnail_url_with_play_button}
        alt={data.title}
      />
      <div className="bg-base-200 p-3">{data.title}</div>
    </div>
  );
};

const QandAPage: NextPage<PageProps> = ({ data, id }: PageProps) => {
  return <>{id}</>;
};

export default QandAPage;
