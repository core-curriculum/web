import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { BackButton } from "@components/buttons/BackButton";
import { useTranslation } from "@services/i18n/i18n";

const HeaderBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center bg-base-100/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const CiteAsPage: NextPage = () => {
  const { t } = useTranslation("@pages/movies");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <div className="max-h-[100dvh]">
        <HeaderBar />
        <div className="m-auto p-2">
          <h1 className="my-8 text-4xl">{t("h1")}</h1>
          <span className="flex items-center justify-center py-4">
            <Link href="https://vimeo.com/showcase/10574193" target="_blank" className="link">
              {t("linkToListPage")}
              <FiExternalLink className="ml-1 inline-block" />
            </Link>
          </span>
          <div className="relative p-0 pt-[56.25%]">
            <iframe
              src="https://vimeo.com/showcase/10574193/embed"
              className="absolute left-0 top-0 h-full w-full border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default CiteAsPage;
