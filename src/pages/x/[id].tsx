import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { MdDownload } from "react-icons/md";
import { Table } from "@components/Table";
import { BackButton } from "@components/buttons/BackButton";
import { toDataUrl } from "@libs/csv";
import { HeaderedTable } from "@libs/tableUtils";
import { Tree } from "@libs/treeUtils";
import { fmt } from "@libs/utils";
import { makeOutcomeTableData, makeTableItemTableData } from "@services/curriculumMapTable";
import { Locale, translationInServer, useLocaleText } from "@services/i18n/i18n";
import { useViewHistory } from "@services/itemList/hooks/viewHistory";
import {
  ServerItemList,
  getSchema,
  SchemaItemsWithValue,
  schemaItemsWithValue,
} from "@services/itemList/local";
import { getItemListFromId, getItemListFromIds } from "@services/itemList/server";
import { loadFullOutcomesTable, makeOutcomesTree } from "@services/outcomes";
import type { OutcomeInfo } from "@services/outcomes";
import { searchOutcomes, searchTables } from "@services/search";
import { getAllTables, loadTableInfoDict, TableInfoSet } from "@services/tables";
import { itemIdToUrl } from "@services/urls";

type PageProps = {
  outcomesTree: Tree<OutcomeInfo>;
  allTables: TableInfoSet[];
  id: string;
  children: ServerItemList[] | false;
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

const getServerItems = async (ids: readonly string[]) => {
  console.log(ids);
  try {
    return (await getItemListFromIds(ids)).flatMap(res => (res.ok ? res.data : []));
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ locale, params }) => {
  const table = loadFullOutcomesTable(locale as Locale);
  const tableInfoDict = loadTableInfoDict(locale as Locale);
  const outcomesTree = makeOutcomesTree(table, tableInfoDict, locale as Locale);
  const allTables = getAllTables(locale as Locale);
  const id = (params?.id as string) ?? "";
  const itemList = await getServerItem(id);
  const children =
    (typeof itemList !== "string" &&
      itemList.children &&
      (await getServerItems(itemList.children))) ??
    false;
  const schemaId = typeof itemList === "string" ? "" : itemList.schema_id;
  const schema = await getSchema(schemaId);
  const { t: t_list } = translationInServer(
    locale as Locale,
    "@services/itemList/libs/schema_list",
  );
  const { t: t_map } = translationInServer(locale as Locale, "@services/itemList/libs/schema_map");
  const t = children ? t_map : t_list;
  const schemaWithValue =
    typeof itemList === "string"
      ? ""
      : schemaItemsWithValue(itemList.data, schema, t as (key: string) => string);
  return {
    props: { outcomesTree, allTables, id, itemList, schemaWithValue, children },
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
    <div className="sticky top-0 m-0 flex w-full items-center bg-base-content/10 backdrop-blur-sm">
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

const downloadQRCode = ({
  canvasId,
  fileName = "QR_Code",
}: {
  canvasId: string;
  fileName: string;
}) => {
  const canvas = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
  if (!canvas) throw new Error("<canvas> not found in the DOM");

  const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  const downloadLink = document.createElement("a");
  downloadLink.href = pngUrl;
  downloadLink.download = `${fileName}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const QrCode = ({ url, imageFileName }: { url: string; imageFileName: string }) => {
  const canvasId = "qr-code-canvas";
  const { t } = useLocaleText("@pages/x/[id]");
  return (
    <Link
      href="#"
      className="cursor-pointer"
      onClick={() => downloadQRCode({ canvasId, fileName: imageFileName })}
    >
      <QRCodeCanvas id={canvasId} size={80} value={url} includeMargin={true} />
      <div className="link-hover link-info link">{t("downLoadQrCode")}</div>
    </Link>
  );
};

type CSVDownloadLinkProps = {
  data: string[][];
  label: string;
  filename: string;
};
const CSVDownloadLink = ({ data, label, filename }: CSVDownloadLinkProps) => {
  console.log(data);
  const url = toDataUrl(data, { withBom: true });
  return (
    <Link download={filename} href={url} className="link-hover link-info link">
      <span className="flex items-center gap-2">
        <MdDownload />
        {label}
      </span>
    </Link>
  );
};

const CSVDownloadLinks = ({
  items,
  allTables,
  outcomesTree,
}: {
  items: ServerItemList[];
  allTables: TableInfoSet[];
  outcomesTree: Tree<OutcomeInfo>;
}) => {
  const { t } = useLocaleText("@pages/x/[id]");
  const l1Data = makeOutcomeTableData(items, outcomesTree, 1);
  const l4Data = makeOutcomeTableData(items, outcomesTree, 4);
  const tableData = makeTableItemTableData(items, allTables);
  const linkDataList = [
    { data: l1Data, label: t("downloadL1"), filename: "outcomes_l1.csv" },
    { data: l4Data, label: t("downloadL4"), filename: "outcomes_l1_to_l4.csv" },
    { data: tableData, label: t("downloadTable"), filename: "tables.csv" },
  ];
  return (
    <div className="mt-8 flex flex-col gap-4 lg:mt-12">
      {linkDataList.map(props => (
        <CSVDownloadLink key={props.filename} {...props} />
      ))}
    </div>
  );
};

const OutcomeAccessInfo = ({ id, isMap, name }: { id: string; isMap: boolean; name: string }) => {
  const { t } = useLocaleText("@pages/x/[id]");
  const link = isMap ? `/map?from=${id}` : `/list?from=${id}`;
  return (
    <div className="m-4 mt-16 flex justify-end text-xs text-gray-600">
      <div>
        <div>{t("accessQRToThisPage")}</div>
        <div className="my-2">
          <QrCode url={itemIdToUrl(id)} imageFileName={name} />
        </div>
        <div className="mb-2 mt-8">{t("descriptionToEdit")}</div>
        <div>
          <Link href={link} className="btn-outline btn">
            {t("startEdit")}
          </Link>
        </div>
        <div className="mt-4">
          <Link href="/map" className="link-hover link-info link">
            {t("makeCurriculumMap")}
          </Link>
        </div>
      </div>
    </div>
  );
};

type OutcomesListProps = {
  allTables: TableInfoSet[];
  outcomesTree: Tree<OutcomeInfo>;
  text: string;
};
const OutcomesList = ({ allTables, outcomesTree, text }: OutcomesListProps) => {
  const { t } = useLocaleText("@pages/x/[id]");
  return (
    <>
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
    </>
  );
};

const ListPage: NextPage<PageProps> = ({
  id,
  outcomesTree,
  allTables,
  itemList,
  children,
  schemaWithValue,
}: PageProps) => {
  const isLoading = !allTables || !outcomesTree || !itemList || !id || !schemaWithValue;
  const { t } = useLocaleText("@pages/x/[id]");
  const { add: addHistory } = useViewHistory();
  if (isLoading) return <div>Loading...</div>;
  if (typeof itemList === "string" || typeof schemaWithValue === "string")
    return (
      <div>
        {t("notFound")}(id:{id})
      </div>
    );
  const text = itemList?.items.join(",") ?? "";
  addHistory(itemList);
  return (
    <>
      <Head>
        <title>{fmt(t("title"), { name: itemList.name })}</title>
      </Head>
      <HeaderBar />
      <div className="ml-4">
        {!children && (
          <div className="mx-4 my-8 text-xs text-base-content/80">{t("descriptionOfItemList")}</div>
        )}
        <ListData values={schemaWithValue} />
        {children ? (
          <CSVDownloadLinks {...{ items: children, allTables, outcomesTree }} />
        ) : (
          <>
            <OutcomesList {...{ allTables, outcomesTree, text, id }} />
          </>
        )}
        <OutcomeAccessInfo
          id={id}
          name={itemList.name}
          isMap={(children && children?.length > 0) ?? false}
        />
      </div>
    </>
  );
};

export default ListPage;
