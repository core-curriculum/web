import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { BackButton } from "@components/buttons/BackButton";

import { ensureWithoutBom, parseCSV } from "@libs/csv";
import { Locale } from "@services/i18n/i18n";
import { moviesDataUrl } from "@services/urls";

type PageProps = {
  data: MovieData[];
};

type MovieData = {
  title: string;
  video_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url_with_play_button: string;
  upload_date: string;
  uri: string;
};
const getOEmbedData = async (movieUrl: string) => {
  const base = `https://vimeo.com/api/oembed.json`;
  const params = new URLSearchParams({
    url: movieUrl,
    autoplay: "true",
    responsive: "true",
  });
  const url = `${base}?${params.toString()}`;
  console.log(url);
  const res = await fetch(url).then(res => res.json());
  console.log(res);
  if (!res) return null;
  return res as MovieData;
};

const loadCsv = async (url: string) => {
  const text = await fetch(url).then(res => res.text());
  if (!text) return null;
  const res = parseCSV(ensureWithoutBom(text));
  const [header, ...body] = res.ok ? (res.value as string[][]) : ([] as string[][]);
  const data = body.map(row => {
    const zipped = header.map((key, i) => [key, row[i]]);
    return Object.fromEntries(zipped) as Record<string, string>;
  });
  console.log(data);
  return data;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ locale }) => {
  const notNull = (x: unknown): x is NonNullable<typeof x> => x !== null && x !== undefined;
  const url = moviesDataUrl(locale as Locale);
  const table = await loadCsv(url);
  const data = table
    ? ((
        await Promise.all(
          table.map(async row => {
            const movieUrl = row["url"];
            const oEmbedData = await getOEmbedData(movieUrl);
            return oEmbedData ? oEmbedData : null;
          }),
        )
      ).filter(notNull) as MovieData[])
    : [];

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

const Card = ({ data }: { data: MovieData }) => {
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

const QandAPage: NextPage<PageProps> = ({ data }: PageProps) => {
  return (
    <>
      <Head>
        <title>QandA</title>
      </Head>
      <HeaderBar />
      <div className="mx-auto flex  max-w-6xl flex-row flex-wrap gap-5 pb-16 ">
        {data.map((movieData, i) => {
          return <Card key={i} data={movieData} />;
        })}
      </div>
    </>
  );
};

export default QandAPage;
