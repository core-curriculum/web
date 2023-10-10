import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { MdDownload } from "react-icons/md";
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
  const { t } = useTranslation("@pages/citeas");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <HeaderBar />
      <div className="m-auto max-w-xl p-2">
        <h1 className="my-8 text-4xl">{t("h1")}</h1>
        <h2 className="my-4 text-2xl">{t("example_title")}</h2>
        <p className="m-4">
          モデル・コア・カリキュラム改訂に関する連絡調整委員会.
          医学教育モデル・コア・カリキュラム（令和4年度改訂版）.
          <Link
            href="http://jsme.umin.ac.jp/eng/core-curriculum.html"
            target="_blank"
            className="link"
          >
            http://jsme.umin.ac.jp/eng/core-curriculum.html.
          </Link>
        </p>
        <p className="m-4">
          Medical Education Model Core Curriculum Expert Research Committee. The Model Core
          Curriculum for Medical Education (2022 Revision). Published 2022.
          <Link
            href="http://jsme.umin.ac.jp/eng/core-curriculum.html"
            target="_blank"
            className="link"
          >
            http://jsme.umin.ac.jp/eng/core-curriculum.html.
          </Link>
        </p>
        <h2 className="mt-8 text-2xl">{t("download")}</h2>
        <div className="mt-8 pb-24">
          <div className="flex gap-4">
            {[
              { title: ".bib(ja)", file: "Core-Curriculum-2022_ja.bib" },
              { title: ".bib(en)", file: "Core-Curriculum-2022_en.bib" },
              { title: ".ris(ja)", file: "Core-Curriculum-2022_ja.ris" },
              { title: ".ris(en)", file: "Core-Curriculum-2022_en.ris" },
            ].map(({ title, file }) => (
              <Link key={file} className="link" href={`/citeas/${file}`} download={file}>
                <MdDownload className="mr-1 inline-block" />
                {title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CiteAsPage;
