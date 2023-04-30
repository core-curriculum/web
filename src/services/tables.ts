import {
  HeaderedTable,
  mapTable,
  reduceTable,
  renameColumns,
  toObjectList,
} from "@libs/tableUtils";
import { MappedText, mapText, MappedInfo } from "@libs/textMapper";
import { loadTable, loadTableIndex } from "@services/loadCsv";
import { Locale } from "./i18n/i18n";
import { AttrInfo, getReplaceMap } from "./replaceMap";

const fileToTableLink = (file: string) => {
  return `/tables/${file}`;
};

type Expand<T extends object> = { [K in keyof T]: T[K] };

const loadTableInfoDict = (locale: Locale) => {
  const trimExt = (filename: string) => filename.replace(/\.[^\.]+$/, "");
  const makeIndexed = <T extends object, K extends keyof T>(
    source: T[],
    key: K,
  ): { [key in T[K] extends string ? T[K] : never]: T } => {
    return source.reduce((indexed, item) => {
      return { ...indexed, [item[key] as string]: item };
    }, {} as { [key in T[K] extends string ? T[K] : never]: T });
  };
  const tableIndex = loadTableIndex(locale);
  const infoList = toObjectList(tableIndex).map(info => {
    const file = trimExt(info.file);
    const link = fileToTableLink(file);
    const columns: Record<string, string> = Object.fromEntries(
      info.columns.split(",").map(entry => entry.split(":")),
    );
    return { ...info, file, link, columns };
  });
  return makeIndexed(infoList, "file");
};

const getTableFiles = (locale: Locale) => {
  return Object.keys(loadTableInfoDict(locale));
};

const getTable = (file: string, locale: Locale): TableInfoSet => {
  const tableInfo = loadTableInfoDict(locale)[file];
  const rawTable = renameColumns(loadTable(file, locale), tableInfo.columns);
  const map = getReplaceMap();
  const attrTable: HeaderedTable<MappedText<AttrInfo>> = mapTable(rawTable, cell =>
    mapText(cell, map),
  );
  const table = mapTable(attrTable, cell => cell.text);
  const attrInfo = reduceTable(
    attrTable,
    (dict, row) => {
      const id = row.id.text;
      const infoLists = Object.entries(row).flatMap(([key, value]) =>
        value.infoList.length > 0 ? [[key, value.infoList] as const] : [],
      );
      const infoDict = Object.fromEntries(infoLists);
      return { ...dict, [id]: infoDict };
    },
    {} as TableAttrInfo,
  );

  return { table, tableInfo, attrInfo };
};

const getAllTables = (locale: Locale): TableInfoSet[] => {
  const files = getTableFiles(locale);
  return files.map((file: string) => getTable(file, locale));
};

type TableInfoDict = ReturnType<typeof loadTableInfoDict>;
type TableInfo = Expand<TableInfoDict[keyof TableInfoDict]>;
type TableAttrInfo = { [id: string]: { [key: string]: MappedInfo<AttrInfo>[] } };
type TableInfoSet = { table: HeaderedTable<string>; tableInfo: TableInfo; attrInfo: TableAttrInfo };

export { loadTableInfoDict, getTableFiles, getTable, getAllTables };
export type { TableInfo, TableInfoDict, TableAttrInfo, TableInfoSet };
