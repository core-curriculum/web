import { toObjectList } from "@libs/tableUtils";
import { loadTable, loadTableIndex } from "@services/loadCsv";

const fileToTableLink = (file: string) => {
  return `/tables/${file}`
}

type Expand<T extends object> = { [K in keyof T]: T[K] };

const loadTableInfoDict = () => {
  const tableIndex = loadTableIndex();
  const dictList = toObjectList(tableIndex);
  return dictList.reduce((dict, line) => {
    const link = fileToTableLink(line.file);
    return { ...dict, [line["file"]]: { ...line, link } };

  }, {} as { [file: string]: Expand<typeof dictList[number] & { link: string }> })
};

const getTableFiles = () => {
  return Object.keys(loadTableInfoDict());
};

const getTable = (file: string) => {
  const table = loadTable(file);
  const tableInfo = loadTableInfoDict()[file];

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
