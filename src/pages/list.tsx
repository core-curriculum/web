import type { NextPage, GetStaticProps } from "next";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ItemContextMenu } from "@components/ItemContextMenu";
import { Table } from "@components/Table";
import { BackButton } from "@components/buttons/BackButton";
import { HeaderedTable } from "@libs/tableUtils";
import { Tree } from "@libs/treeUtils";
import { useLocalItemList } from "@services/localItemList";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { searchOutcomes, searchTables } from "@services/search";
import { getAllTables, loadTableInfoDict, TableInfo } from "@services/tables";

type PageProps = {
  outcomesTree: Tree<OutcomeInfo>;
  allTables: { table: HeaderedTable<string>; tableInfo: TableInfo }[];
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const table = loadFullOutcomesTable();
  const tableInfoDict = loadTableInfoDict();
  const outcomesTree = makeOutcomesTree(table, tableInfoDict);
  const allTables = getAllTables();

  return {
    props: { outcomesTree, allTables },
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

const ShareButton = () => {
  const { items, shareItemList } = useLocalItemList();
  const [sharing, setSharing] = useState(false);
  const share = async () => {
    setSharing(true);
    try {
      const inserted = await shareItemList();
      confirm(JSON.stringify(inserted));
    } catch (e) {
      toast((e as Error).message);
    }
    setSharing(false);
  };
  return (
    <>
      <button className="btn" disabled={items.length === 0 || sharing} onClick={share}>
        共有する
      </button>
    </>
  );
};

const ListPage: NextPage<PageProps> = ({ outcomesTree, allTables }: PageProps) => {
  const { items } = useLocalItemList();
  const text = items.join(",");
  return (
    <>
      <div className="ml-4">
        <HeaderBar />
        <div>
          {searchOutcomes(outcomesTree, text).map((item) => (
            <div className="m-4" key={item.id}>
              <div>
                <span className="mr-2 font-light text-sky-600">{item.index}</span>
                {item.text}
                <ItemContextMenu id={item.id} index={item.index} />
              </div>
              <Breadcrumb parents={item.parents} />
            </div>
          ))}
        </div>
        <div className="ml-4">
          {searchTables(text, allTables).map(({ table, tableInfo }) => {
            const title = `表${tableInfo.number}. ${tableInfo.item}`;

            return (
              <div key={tableInfo.id}>
                <div>
                  <div className="my-4">{title}</div>
                  <Table table={table as HeaderedTable<string>} tableInfo={tableInfo} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="m-8">
        <ShareButton />
      </div>
    </>
  );
};

export default ListPage;
