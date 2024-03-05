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
      ? (await import("json_in_repo/q-and-a/ja.json")).default
      : (await import("json_in_repo/q-and-a/en.json")).default;
  return {
    props: { data },
  };
};

const HeaderBar = () => {
  return (
    <div className="bg-base-100/80 sticky top-0 flex w-full items-center backdrop-blur-sm">
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
          const index = i + 1;
          return (
            <section key={question} className="mx-auto mb-16 max-w-3xl">
              <h3 className="text-base-content my-4 text-lg">
                <span className="text-accent font-bold">Q{index}.</span> {question}
              </h3>
              <p className="text-base-content ml-2">
                <span className="text-accent">A{index}.</span> {answer}
              </p>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default QandAPage;
