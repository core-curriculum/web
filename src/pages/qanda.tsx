import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { BackButton } from "@components/buttons/BackButton";

import { ensureWithoutBom, parseCSV } from "@libs/csv";
import { Locale } from "@services/i18n/i18n";
import { qAndAUrl } from "@services/urls";

type PageProps = {
  data: { question: string; answer: string }[];
};

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ locale }) => {
  const url = qAndAUrl(locale as Locale);
  const text = await fetch(url).then(res => res.text());
  if (!text) {
    return {
      props: { data: [] },
    };
  }
  const res = parseCSV(ensureWithoutBom(text));
  const [header, ...body] = res.ok ? (res.value as string[][]) : ([] as string[][]);
  const data = body.map(row => {
    const zipped = header.map((key, i) => [key, row[i]]);
    return Object.fromEntries(zipped) as { question: string; answer: string };
  });
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

const QandAPage: NextPage<PageProps> = ({ data }: PageProps) => {
  return (
    <>
      <Head>
        <title>QandA</title>
      </Head>
      <HeaderBar />
      <div className="m-4 pb-24">
        {data.map(({ question, answer }, i) => {
          return (
            <section key={i} className="mb-16 max-w-xl">
              <h3 className="my-4 text-lg text-base-content">
                <span className="font-bold text-primary">Q{i + 1}.</span> {question}
              </h3>
              <p className="ml-2 text-base-content">
                <span className="text-primary">A.</span> {answer}
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default QandAPage;
