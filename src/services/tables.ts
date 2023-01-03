import { renameColumns, toObjectList } from "@libs/tableUtils";
import { loadTable, loadTableIndex } from "@services/loadCsv";

const fileToTableLink = (file: string) => {
  return `/tables/${file}`
}

type Expand<T extends object> = { [K in keyof T]: T[K] };

const loadTableInfoDict = () => {
  const trimExt = (filename: string) => filename.replace(/\.[^\.]+$/, "");
  const makeIndexed = <T extends object, K extends keyof T>(
    source: T[], key: K
  ): { [key in T[K] extends string ? T[K] : never]: T } => {
    return source.reduce((indexed, item) => {
      return { ...indexed, [item[key] as string]: item }
    }, {} as { [key in T[K] extends string ? T[K] : never]: T })
  }
  const tableIndex = loadTableIndex();
  const infoList = toObjectList(tableIndex).map((info) => {
    const file = trimExt(info.file);
    const link = fileToTableLink(file);
    const columns: Record<string, string> = Object.fromEntries(
      info.columns.split(",").map((entry) => entry.split(":"))
    );
    return { ...info, file, link, columns }
  })
  return makeIndexed(infoList, "file")
};

const getTableFiles = () => {
  return Object.keys(loadTableInfoDict());
};

const getTable = (file: string) => {
  const tableInfo = loadTableInfoDict()[file];
  const table = renameColumns(loadTable(file), tableInfo.columns);

  return { table, tableInfo };
};

const getAllTables = () => {
  const files = getTableFiles();
  return files.map(getTable);
};

type TableInfoDict = ReturnType<typeof loadTableInfoDict>;
type TableInfo = Expand<TableInfoDict[keyof TableInfoDict]>


export { loadTableInfoDict, getTableFiles, getTable, getAllTables };
export type { TableInfo, TableInfoDict };
