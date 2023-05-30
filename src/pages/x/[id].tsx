import type { NextPage, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";
import { Table } from "@components/Table";
import { BackButton } from "@components/buttons/BackButton";
import { HeaderedTable } from "@libs/tableUtils";
import { Tree } from "@libs/treeUtils";
import { Locale, useLocaleText } from "@services/i18n/i18n";
import { useAddViewHistory } from "@services/itemList/hooks/viewHistory";
import {
  ServerItemList,
  getSchema,
  SchemaItemsWithValue,
  schemaItemsWithValue,
} from "@services/itemList/local";
import { getItemListFromId } from "@services/itemList/server";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { searchOutcomes, searchTables } from "@services/search";
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

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale, params }) => {
  const table = loadFullOutcomesTable(locale as Locale);
  const tableInfoDict = loadTableInfoDict(locale as Locale);
  const outcomesTree = makeOutcomesTree(table, tableInfoDict, locale as Locale);
  const allTables = getAllTables(locale as Locale);
  const id = (params?.id as string) ?? "";
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

const ListData = ({ values }: { values: SchemaItemsWithValue }) => {
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

const QrCode = () => {
  const router = useRouter();
  const origin =
    typeof window !== "undefined" && window?.location
      ? window?.location?.origin
      : "https://core-curriculum.jp";
  const url = origin + router.asPath;
  return (
    <>
      <QRCodeCanvas size={80} value={url} />
    </>
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
  const { t } = useLocaleText("@pages/x/[id]");
  const addHistory = useAddViewHistory();
  if (isLoading) return <div>Loading...</div>;
  if (typeof itemList === "string" || typeof schemaWithValue === "string")
    return <div>該当するリストが見つかりません。(id:{id})</div>;
  const text = itemList?.items.join(",") ?? "";
  addHistory(itemList);
  return (
    <>
      <div className="ml-4">
        <HeaderBar />
        <ListData values={schemaWithValue} />
        <div>
          {searchOutcomes(outcomesTree, text).map(item => (
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
            const title = `${t("table") + tableInfo.number}. ${tableInfo.item}`;

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
        <div className="m-4 mt-16 flex justify-end text-xs text-gray-600">
          <div>
            <div>このリストは以下のコードでアクセスできます</div>
            <div className="my-2 flex justify-end">
              <QrCode />
            </div>
            <div className="mt-8 mb-2">関連する項目や授業名を変更する場合は以下から</div>
            <div>
              <Link href={`/list?from=${id}`} className="btn-outline  btn">
                このリストを元に新しいリストを作成
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
