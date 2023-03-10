import * as path from "path";
import { readTextFileSync } from "@libs/fileUtis";
import { parseCSV } from "@libs/parseCSV";
import type { HeaderedTable } from "@libs/tableUtils";
import { outcomeDir, tableDir } from "@services/paths";

type Table<HEADER extends ReadonlyArray<string> = readonly string[]> =
  [readonly [...HEADER], ...ReadonlyArray<ReadonlyArray<string>>];
type LayerHeaderCommon = readonly ["index", "id", "item"];
type LayerHeader1 = readonly [...LayerHeaderCommon, "description", "spell"]
type LayerHeader2 = readonly [...LayerHeaderCommon, "description", "parent"]
type LayerHeader3 = readonly [...LayerHeaderCommon, "parent"]
type LayerHeader4 = readonly [...LayerHeaderCommon, "parent"]
type LayerHeaders = {
  "1": LayerHeader1;
  "2": LayerHeader2;
  "3": LayerHeader3;
  "4": LayerHeader4;
};
type LayerTag = keyof LayerHeaders;
type TableIndexHeader = readonly ["file", "item", "id", "legend", "number", "index", "columns"]


const loadCsv = <HEADER extends readonly string[] = string[]>(path: string) => {
  const data = readTextFileSync(path);
  const res = parseCSV(data);
  if (!res.ok) throw new Error(`error parsing file:${path}`);
  return res.value as unknown as Table<HEADER>;
};

const tablaCache = new Map<string, HeaderedTable<string, string[]>>()
const makeCache = <T>() => {
  const cache = new Map<string, T>();
  return (key: string, getFunc: (key: string) => T) => {
    if (cache.has(key)) {
      return cache.get(key) as T;
    } else {
      const value = getFunc(key);
      cache.set(key, value);
      return value;
    }
  }
}
const cachedTable = makeCache<Table>();
const loadCachedTable = (filename: string) => {
  const load = (file: string) => {
    const data = loadCsv(file);
    return data;

  }
  return cachedTable(filename, load);
}

const loadOutcomes = <T extends LayerTag>(layer: T) => {
  const filename = path.resolve(outcomeDir, `layer${layer}.csv`);
  return loadCachedTable(filename) as Table<LayerHeaders[T]>;
}

const loadTable = (tableFile: string) => {
  const filename = path.resolve(tableDir, `${tableFile}.csv`);
  return loadCachedTable(filename);
}

const loadTableIndex = () => {
  const filename = path.resolve(tableDir, `index.csv`);
  return loadCachedTable(filename) as Table<TableIndexHeader>;
}

const table = loadOutcomes("1")



export { loadOutcomes, loadTable, loadTableIndex };
