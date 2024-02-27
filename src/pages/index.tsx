import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { GeneralGuidance } from "@components/GeneralGuidance";
import { MainLayout } from "@components/MainLayout";
import { OutcomesTree } from "@components/Outcomes";
import { MenuItem, OutcomesTOC } from "@components/OutcomesTOC";
import type { Tree } from "@libs/treeUtils";
import { Locale, useLocale, useLocaleText } from "@services/i18n/i18n";
import { loadOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";

type PageProps = { outcomesTree: Tree<OutcomeInfo> };

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const outcomesTree = await loadOutcomesTree(locale as Locale);

  return {
    props: { outcomesTree },
  };
};

const Footer: React.FC = () => {
  const { t } = useLocaleText("@components/Footer");
  const { locale } = useLocale();
  const linkToData =
    locale === "ja"
      ? "https://github.com/core-curriculum/data"
      : "https://github.com/core-curriculum/data/tree/main/2022/en";
  return (
    <footer className="text-base-content/80 px-5 py-4 text-center text-sm">
      <div
        className="border-t-base-content/80
      grid grid-cols-1 justify-items-center gap-3 border-t-[1px] px-5 py-2"
      >
        <p className="text-xs">{t("description")}</p>
        <p className="flex flex-row gap-2">
          <Link href="https://github.com/core-curriculum/web" className="link" target="_blank">
            Github Repository
            <FiExternalLink className="ml-1 inline-block" />
          </Link>
          <Link href={linkToData} className="link" target="_blank">
            {t("linkForData")}
            <FiExternalLink className="ml-1 inline-block" />
          </Link>
        </p>
      </div>
    </footer>
  );
};

const Home: NextPage<PageProps> = ({ outcomesTree }: PageProps) => {
  const { t } = useLocaleText("@pages/index");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <MainLayout
        content={
          <>
            <GeneralGuidance
              className="m-4 mx-auto my-[min(10vh,5rem)] 
            w-[clamp(20rem,80%,800px)]"
            />
            <h1 className="m-4 text-6xl font-thin">{t("outcomesTitle")}</h1>
            <p className="m-6">{t("discription")}</p>
            <OutcomesTree outcomesTree={outcomesTree} />
            <Footer />
          </>
        }
        menu={
          <menu>
            <OutcomesTOC outcomesTree={outcomesTree} />
            <MenuItem href="./tables">{t("tables")}</MenuItem>
          </menu>
        }
      />
    </>
  );
};

export default Home;
