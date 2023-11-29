import { HeaderedTable } from "@libs/tableUtils";
import { MappedInfo } from "@libs/textMapper";
import { AttrInfo } from "./attrInfo";
import { Locale } from "./i18n/i18n";

type Expand<T extends object> = { [K in keyof T]: T[K] };

const loadAttrInfo = async (locale: Locale) => {
  return (
    locale === "ja"
      ? (await import(`json_in_repo/outcomes/ja/attr_info.json`)).default
      : (await import(`json_in_repo/outcomes/en/attr_info.json`)).default
  ) as {
    [key: string]: { [item: string]: { info: AttrInfo; gap: number; length: number }[] };
  };
};

const loadIdInfoList = async (locale: Locale) => {
  return locale === "ja"
    ? (await import(`json_in_repo/outcomes/ja/id_list.json`)).default
    : (await import(`json_in_repo/outcomes/en/id_list.json`)).default;
};

const loadTableInfoDict = async (locale: Locale) => {
  return locale === "ja"
    ? (await import(`json_in_repo/outcomes/ja/table_info.json`)).default
    : (await import(`json_in_repo/outcomes/en/table_info.json`)).default;
};

const getTableFiles = async (locale: Locale) => {
  return Object.keys(await loadTableInfoDict(locale)) as TableFile[];
};

const getTalbleInfoList = async (locale: Locale) => {
  return Object.values(await loadTableInfoDict(locale));
};

const getTable = async (file: TableFile, locale: Locale): Promise<TableInfoSet> => {
  const tableInfo = (await loadTableInfoDict(locale))[file];
  const idInfoList = await loadIdInfoList(locale);
  type ColumnKey = keyof typeof tableInfo.columns;
  const tableHeader = [
    "id",
    "index",
    ...tableInfo.header.map(key => tableInfo.columns[key as ColumnKey]),
  ];
  const tableBody = idInfoList
    .filter(([_, item]) => item.type === file)
    .map(([id, { index, ...item }]) => {
      const row = tableInfo.header.map(key => item[key] ?? "");
      return [id, index, ...row];
    });
  const table = [tableHeader, ...tableBody] as readonly [
    readonly string[],
    ...(readonly string[])[],
  ];
  const rowIdList = tableBody.map(([id]) => id);
  const attrInfoDict = await loadAttrInfo(locale);
  const attrInfoEntries = rowIdList
    .filter(id => attrInfoDict[id])
    .map(id => [id, attrInfoDict[id]]);
  const attrInfo: TableAttrInfo = Object.fromEntries(attrInfoEntries);
  return { table, tableInfo, attrInfo };
};

const getAllTables = async (locale: Locale): Promise<TableInfoSet[]> => {
  const files = await getTableFiles(locale);
  return Promise.all(files.map(file => getTable(file, locale)));
};

type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;
type TableInfoDict = PromiseType<ReturnType<typeof loadTableInfoDict>>;
type TableFile = keyof TableInfoDict;
type TableInfo = Expand<TableInfoDict[TableFile]>;
type TableAttrInfo = { [id: string]: { [key: string]: MappedInfo<AttrInfo>[] } };
type TableInfoSet = { table: HeaderedTable<string>; tableInfo: TableInfo; attrInfo: TableAttrInfo };

export { loadTableInfoDict, getTableFiles, getTable, getAllTables, getTalbleInfoList };
export type { TableInfo, TableInfoDict, TableAttrInfo, TableInfoSet, TableFile };
