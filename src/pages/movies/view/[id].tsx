import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, Locales, useTranslation } from "@services/i18n/i18n";
import { isMovieData, loadMovieData, type MovieData, FileList } from "..";

type PageProps = {
  data: MovieData | undefined;
  id: string;
};

type PathParams = {
  id: string;
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = (
    await Promise.all(
      (["en", "ja"] as Locales).map(async locale => {
        return (await loadMovieData(locale as Locale))
          .filter(isMovieData)
          .map(({ id }) => ({ params: { id }, locale }));
      }),
    )
  ).flat();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale, params }) => {
  const id = (params?.id as string) || "";
  const allData = await loadMovieData(locale as Locale);
  const data = allData.filter(isMovieData).find(({ id: _id }) => _id === id);
  return {
    props: { data, id },
  };
};

const HeaderBar = () => {
  const params = useSearchParams();
  const returnPath = params.get("return_to") || "../";
  return (
    <div className="bg-base-100/80 sticky top-0 flex w-full items-center backdrop-blur-sm">
      <div className="ml-2">
        <BackButton href={returnPath} />
      </div>
    </div>
  );
};

const textToTextWithLink = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const texts = text.split(urlRegex);
  return texts.map((text, i) => {
    return (
      <span key={i}>
        {text.match(urlRegex) ? (
          <Link className="link" href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </Link>
        ) : (
          text
        )}
      </span>
    );
  });
};

const Desctiption = ({ text }: { text: string }) => {
  const texts = text.split("\n");
  return (
    <div className="bg-base-200 p-3 text-sm">
      {texts.map((text, i) => {
        return <p key={i}>{textToTextWithLink(text)}</p>;
      })}
    </div>
  );
};

const Card = ({ data: movieData }: { data: MovieData }) => {
  const { t } = useTranslation("@pages/movies");
  const { title, description, data, filesInfo } = movieData;
  console.log(data.player_url);
  return (
    <div>
      <Head>
        <title>{`${title} | ${t("siteTitle")}`}</title>
      </Head>
      <HeaderBar />
      <div className="relative p-0 pt-[56.25%]">
        <iframe
          src={data.player_url}
          className="absolute left-0 top-0 h-full w-full border-0"
        ></iframe>

        <script src="https://player.vimeo.com/api/player.js" async></script>
      </div>

      <div className="bg-base-200 p-3 text-lg font-bold">{title || data.title}</div>
      <div className="bg-base-200 p-3 text-sm">
        <Desctiption text={description || data.description} />
        <FileList filesInfo={filesInfo} hasTitle={true} />
      </div>
    </div>
  );
};

const MovieViewPage: NextPage<PageProps> = ({ data, id }: PageProps) => {
  return <>{data ? <Card {...{ data }} /> : `not found ${id}`}</>;
};

export default MovieViewPage;
