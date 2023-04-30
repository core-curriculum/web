import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { getNameColumnValues, mapRow } from "@libs/tableUtils";
import type { HeaderedTable } from "@libs/tableUtils";
import type { Locale } from "@services/i18n/i18n";
import { loadTable } from "@services/loadCsv";

type PageProps = { table: HeaderedTable<string> };

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale }) => {
  const table = loadTable("TBL0500", locale as Locale);

  return {
    props: { table },
  };
};

const Home: NextPage<PageProps> = ({ table }: PageProps) => {
  const skillTable = mapRow<
    string,
    { name: string; id: string; index: string; diseases: string[] }
  >(table, row => ({
    main: {
      name: row["item"],
      diseases: row["ddx"].split(",").filter(v => v.trim() !== ""),
      id: row["id"],
      index: row["index"],
    },
  }));
  const list = getNameColumnValues(skillTable, "main");
  return (
    <>
      <Head>
        <title>Symptoms Checklists</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="m-4 text-xl font-bold">経験した症候</h1>
      <table className="m-4 table">
        <thead>
          <tr className="sticky top-0 mr-4 ml-10 py-1 ">
            <th className="pl-4 text-left">症候</th>
            <th className="p-2 text-center">鑑別を考慮した疾患</th>
          </tr>
        </thead>
        <tbody>
          {list.map((unit, j) => (
            <tr key={j}>
              <td>{unit.name}</td>
              <td className="whitespace-normal">
                {unit.diseases.map((disease, i) => (
                  <span className="mr-4 whitespace-nowrap" key={i}>
                    <input type="checkbox" className="checkbox" id={unit.index + i} />
                    <label className="ml-1 align-top" htmlFor={unit.index + i}>
                      {disease}
                    </label>
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
