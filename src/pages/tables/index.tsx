import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { BackButton } from "@components/buttons/BackButton";
import { Locale, useLocaleText } from "@services/i18n/i18n";
import { getTalbleInfoList, TableInfo } from "@services/tables";

type PageProps = { tables: TableInfo[] };

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  return {
    props: { tables: await getTalbleInfoList(locale as Locale) },
  };
};

const TableList: NextPage<PageProps> = ({ tables }: PageProps) => {
  const { t } = useLocaleText("@pages/list/tables");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <header className="flex items-center p-2">
        <div>
          <BackButton />
        </div>
        <div>
          <h1 className="m-4 text-xl font-bold">{t("h1")}</h1>
        </div>
      </header>
      <div className="md:pl-10">
        {tables.map(({ link, item, index, number }) => {
          const name = `${t("table") + number}. ${item}`;
          return (
            <div key={index} className="mx-auto p-2">
              <Link
                href={{ pathname: link, query: { referer: "/tables" } }}
                className="link-info link"
              >
                {name}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TableList;
