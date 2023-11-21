import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, Locales } from "@services/i18n/i18n";
import { MovieData } from ".";

type PageProps = {
  data: MovieData | undefined;
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
  const allData =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja.json`)).default
      : (await import(`json_in_repo/movies/en.json`)).default;
  const data = allData.find(({ id: _id }) => _id === id);
  return {
    props: { data, id },
  };
};

const HeaderBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center bg-base-100/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton href="./" />
      </div>
    </div>
  );
};

const Card = ({ data }: { data: MovieData["data"] }) => {
  return (
    <div>
      <HeaderBar />
      <div className="relative p-0 pt-[56.25%]">
        <iframe
          src={data.player_url}
          className="absolute left-0 top-0 h-full w-full border-0"
        ></iframe>
      </div>

      <div className="bg-base-200 p-3">{data.title}</div>
    </div>
  );
};

const QandAPage: NextPage<PageProps> = ({ data, id }: PageProps) => {
  return <>{data ? <Card data={data.data} /> : `not found ${id}`}</>;
};

export default QandAPage;
