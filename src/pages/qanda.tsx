import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { BackButton } from "@components/buttons/BackButton";
import { Locale } from "@services/i18n/i18n";

type PageProps = {
  data: { question: string; answer: string }[];
};

type QandA = { question: string; answer: string }[];

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  locale = locale as Locale;
  const data =
    locale === "ja"
      ? (await import(`json_in_repo/q-and-a/ja.json`)).default
      : (await import(`json_in_repo/q-and-a/en.json`)).default;
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
            <section key={i} className="mx-auto mb-16 max-w-3xl">
              <h3 className="my-4 text-lg text-base-content">
                <span className="font-bold text-accent">Q{i + 1}.</span> {question}
              </h3>
              <p className="ml-2 text-base-content">
                <span className="text-accent">A{i + 1}.</span> {answer}
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default QandAPage;
