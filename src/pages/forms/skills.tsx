import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import { getNameColumnValues, mapRow } from "@libs/tableUtils";
import type { HeaderedTable } from "@libs/tableUtils";
import { loadTable } from "@services/loadCsv";

type PageProps = { table: HeaderedTable<string> };

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const table = loadTable("TBL0300");

  return {
    props: { table },
  };
};

type RatingCheckProp = { name: string };
const RatingCheck = ({ name }: RatingCheckProp) => (
  <fieldset className="whitespace-nowrap ">
    <input name={name} type="radio" value="1" className="radio" />
    <input name={name} type="radio" value="2" className="radio" />
    <input name={name} type="radio" value="3" className="radio" />
    <input name={name} type="radio" value="4" className="radio" />
    <input name={name} type="radio" value="5" className="radio" />
  </fieldset>
);

const Home: NextPage<PageProps> = ({ table }: PageProps) => {
  const skillTable = mapRow<string, { name: string; id: string; index: string }>(table, (row) => ({
    skill: {
      name: row["item"],
      id: row["id"],
      index: row["index"],
    },
  }));
  const skillList = getNameColumnValues(skillTable, "skill");
  return (
    <>
      <Head>
        <title>Skills Checklists</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="m-4 text-xl font-bold">基本的臨床手技</h1>
      <table className="m-4 table">
        <thead>
          <tr className="mr-4 ml-10 py-1">
            <th className="pl-4 text-left">基本的臨床手技</th>
            <th className="p-2 text-center">
              <div>自己評価</div>
              <div className="text-sm">1-5</div>
            </th>
            <th className="p-2 text-center">
              <div>指導者評価</div> <div className="text-sm">1-5</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {skillList.map((skill, i) => (
            <tr key={i}>
              <td>{skill.name}</td>
              <td>
                <RatingCheck name={skill.index + "-self"} />
              </td>
              <td>
                <RatingCheck name={skill.index + "-inst"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;
