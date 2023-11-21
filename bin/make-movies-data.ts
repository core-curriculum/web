import { ensureWithoutBom, parseCSV } from "@libs/csv";
import { Locale } from "@services/i18n/i18n";
import { moviesDataUrl } from "@services/urls";

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

const makeData = async (locale: Locale) => {
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

  console.log(data);
};

makeData("ja");
