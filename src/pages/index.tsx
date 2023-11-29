import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { GeneralGuidance } from "@components/GeneralGuidance";
import { MainLayout } from "@components/MainLayout";
import { OutcomesTree } from "@components/Outcomes";
import { MenuItem, OutcomesTOC } from "@components/OutcomesTOC";
import type { Tree } from "@libs/treeUtils";
import { Locale, useLocaleText } from "@services/i18n/i18n";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { loadTableInfoDict } from "@services/tables";

type PageProps = { outcomesTree: Tree<OutcomeInfo> };

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const table = loadFullOutcomesTable(locale as Locale);
  const tableInfoDict = loadTableInfoDict(locale as Locale);
  const outcomesTree = makeOutcomesTree(table, tableInfoDict, locale as Locale);

  return {
    props: { outcomesTree },
  };
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
