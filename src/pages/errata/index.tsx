import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { BackButton } from "@components/buttons/BackButton";
import { Locale, useTranslation } from "@services/i18n/i18n";

type ErrataInfo = {
  position: string;
  error: string;
  correct: string;
  comment: string;
  date: string;
};
type PageProps = {
  data: ErrataInfo[];
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  locale = locale as Locale;
  const data = locale === "ja" ? (await import("json_in_repo/errata/ja.json")).default : [];
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

const ErrataAPage: NextPage<PageProps> = ({ data }: PageProps) => {
  const { t } = useTranslation("@pages/errata");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <HeaderBar />
      <h1 className="text-base-content mt-4 text-center text-3xl">{t("h1")}</h1>
      <div className="m-4 pb-24">
        {data.map(({ position, error, correct, comment, date }, i) => {
          return (
            <section key={error} className="mx-auto mb-16 max-w-3xl">
              <h3 className="text-base-content my-4 text-lg">{position}</h3>
              <p className="text-base-content ml-2">
                <span className="text-accent">{t("errorHeader")}</span> {error}
              </p>
              <p className="text-base-content ml-2">
                <span className="text-accent">{t("correctHeader")}</span> {correct}
              </p>
              {comment && (
                <p className="text-base-content ml-2">
                  <span className="text-accent">{t("commentHeader")}</span> {comment}
                </p>
              )}
              <p className="text-base-content/40 ml-2 text-xs">{date}</p>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default ErrataAPage;
