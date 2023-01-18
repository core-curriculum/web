import type { NextPage, GetStaticProps } from "next";
import { Table } from "@components/Table";
import { BackButton } from "@components/buttons/BackButton";
import { HeaderedTable } from "@libs/tableUtils";
import { Tree } from "@libs/treeUtils";
import { ServerItemList } from "@services/itemList";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { getSchema, schemaItemsWithValue, SchemaItemsWithValue } from "@services/schema";
import { searchOutcomes, searchTables } from "@services/search";
import { getItemListFromId } from "@services/serverItemList";
import { getAllTables, loadTableInfoDict, TableInfoSet } from "@services/tables";

type PageProps = {
  outcomesTree: Tree<OutcomeInfo>;
  allTables: TableInfoSet[];
  id: string;
  itemList: ServerItemList | string;
  schemaWithValue: SchemaItemsWithValue | string;
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

const getServerItem = async (id: string) => {
  try {
    return await getItemListFromId(id);
  } catch (e) {
    console.error(e);
    return id;
  }
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const table = loadFullOutcomesTable();
  const tableInfoDict = loadTableInfoDict();
  const outcomesTree = makeOutcomesTree(table, tableInfoDict);
  const allTables = getAllTables();
  const id = (context.params?.id as string) ?? "";
  const itemList = await getServerItem(id);
  const schemaId = typeof itemList === "string" ? "" : itemList.schema_id;
  const schema = await getSchema(schemaId);
  const schemaWithValue =
    typeof itemList === "string" ? "" : schemaItemsWithValue(itemList, schema);
  return {
    props: { outcomesTree, allTables, id, itemList, schemaWithValue },
  };
};

const Breadcrumb = ({ parents }: { parents: OutcomeInfo[] }) => {
  return (
    <>
      {parents.map((parent, i) => {
        return (
          <span className="text-xs text-gray-400" key={parent.id}>
            {i !== 0 ? ` / ` : ""}
            <span>
              {parent.index.slice(-2)}
              {parent.text}
            </span>
          </span>
        );
      })}
    </>
  );
};

const HeaderBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center bg-white/80 backdrop-blur-sm">
      <div className="ml-2">
        <BackButton />
      </div>
    </div>
  );
};

const ExData = ({ values }: { values: SchemaItemsWithValue }) => {
  return (
    <div className="m-2">
      {values.map(({ label, key, value }) => {
        return (
          <section key={key} className="m-2">
            <label>{label ?? key}</label>
            <span className="ml-2 text-lg font-bold">{value}</span>
          </section>
        );
      })}
    </div>
  );
};

const ListPage: NextPage<PageProps> = ({
  id,
  outcomesTree,
  allTables,
  itemList,
  schemaWithValue,
}: PageProps) => {
  const isLoading = !allTables || !outcomesTree || !itemList || !id || !schemaWithValue;
  if (isLoading) return <div>Loading...</div>;
  if (typeof itemList === "string" || typeof schemaWithValue === "string")
    return <div>該当するリストが見つかりません。(id:{id})</div>;
  const text = itemList?.items.join(",") ?? "";
  return (
    <>
      <div className="ml-4">
        <HeaderBar />
        <ExData values={schemaWithValue} />
        <div>
          {searchOutcomes(outcomesTree, text).map((item) => (
            <div className="m-4" key={item.id}>
              <div>
                <span className="mr-2 font-light text-sky-600">{item.index}</span>
                {item.text}
              </div>
              <Breadcrumb parents={item.parents} />
            </div>
          ))}
        </div>
        <div className="ml-4">
          {searchTables(text, allTables).map(({ table, tableInfo, attrInfo }) => {
            const title = `表${tableInfo.number}. ${tableInfo.item}`;

            return (
              <div key={tableInfo.id}>
                <div>
                  <div className="my-4">{title}</div>
                  <Table {...{ table: table as HeaderedTable<string>, tableInfo, attrInfo }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ListPage;
