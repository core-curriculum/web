import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MdDownload } from "react-icons/md";
import { BackButton } from "@components/buttons/BackButton";

import { Locale, Locales, useTranslation } from "@services/i18n/i18n";
import { MovieData } from "..";

type FileInfo = {
  name: string;
  file: string;
  downloadUrl: string;
};

type PageProps = {
  data: MovieData | undefined;
  filesInfo: FileInfo[];
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
  const allFilesInfo =
    locale === "ja"
      ? (await import(`json_in_repo/movies/ja-files.json`)).default
      : (await import(`json_in_repo/movies/en-files.json`)).default;
  const data = allData.find(({ id: _id }) => _id === id);
  const files = data?.files.split(",").map(v => v.trim()) || [];
  const filesInfo = allFilesInfo.filter(({ file }) => files.some(f => f === file));
  return {
    props: { data, id, filesInfo },
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

const FileInfo = ({ name, downloadUrl }: { name: string; downloadUrl: string }) => {
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

const FileList = ({
  filesInfo,
}: {
  filesInfo: { name: string; file: string; downloadUrl: string }[];
}) => {
  const { t } = useTranslation("@pages/movies");
  if (filesInfo.length === 0) return <></>;
  const infoList = [...filesInfo].sort(({ name: name1 }, { name: name2 }) =>
    new Intl.Collator("ja").compare(name1, name2),
  );
  return (
    <div className="bg-base-200 flex flex-col gap-4 p-3 text-sm">
      <h3 className="text-base-content mt-10 text-xl">{t("filesTitle")}</h3>
      {infoList.map(({ name, downloadUrl }, i) => {
        return <FileInfo key={i} name={name} downloadUrl={downloadUrl} />;
      })}
    </div>
  );
};

const Card = ({ data: movieData, filesInfo }: { data: MovieData; filesInfo: FileInfo[] }) => {
  const { t } = useTranslation("@pages/movies");
  const { title, description, data } = movieData;
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
      </div>

      <div className="bg-base-200 p-3 text-lg font-bold">{title || data.title}</div>
      <div className="bg-base-200 p-3 text-sm">
        <Desctiption text={description || data.description} />
        <FileList filesInfo={filesInfo} />
      </div>
    </div>
  );
};

const MovieViewPage: NextPage<PageProps> = ({ data, id, filesInfo }: PageProps) => {
  return <>{data ? <Card {...{ filesInfo, data }} /> : `not found ${id}`}</>;
};

export default MovieViewPage;
