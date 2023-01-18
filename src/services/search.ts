import { filterRow, HeaderedTable } from "@libs/tableUtils";
import { Tree, searchMap } from "@libs/treeUtils";
import type { OutcomeInfo } from "@services/outcomes";
import { TableAttrInfo, TableInfo } from "@services/tables";

const matchID = (targetId: string, searchTextFrag: string) => {
  if (searchTextFrag.match(/[0-9a-zA-Z\-_]{7}(\,[0-9a-zA-Z\-_]{7})*/)) {
    const ids = searchTextFrag.split(",");
    return ids.includes(targetId);
  }
  return false;
};

const matchIndex = (targetIndex: string, searchTextFrag: string) => {
  const indexPattern = String.raw`[a-zA-Z]{2}(\-[0-9]{2}){0,3}`;
  const indexsReg = new RegExp(String.raw`${indexPattern}(\,${indexPattern})*`);
  if (searchTextFrag.match(indexsReg)) {
    const indexs = searchTextFrag.split(",");
    return indexs.includes(targetIndex);
  }
  return false;
};

const matchOutcomesItem = (item: OutcomeInfo, searchTextFrag: string) => {
  return (
    matchID(item.id, searchTextFrag) ||
    matchIndex(item.index, searchTextFrag) ||
    item.text.includes(searchTextFrag)
  );
};

const searchOutcomes = (outcomesTree: Tree<OutcomeInfo>, searchText: string) => {
  const frags = searchText
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "");
  if (frags.length === 0) return [];
  return searchMap(outcomesTree, (item, hasChildren, parents) => {
    const match = frags.every((frag) => matchOutcomesItem(item, frag));
    if (match) return { ...item, parents };
  });
};

const searchTable = (
  searchText: string, table: HeaderedTable<string>,
) => {
  const frags = searchText
    .split(" ")
    .map((s) => s.trim())
    .filter((s) => s !== "");
  if (frags.length < 1) return [table[0]];
  const filtered = filterRow(table, (rowDict, row) => {
    return frags.every((frag) => {
      if (matchID(rowDict["id"], frag)) return true;
      return row.some((cell) => cell.includes(frag));
    });
  });
  return filtered;
};

const searchTables = (
  searchText: string,
  tables: { table: HeaderedTable<string>; tableInfo: TableInfo, attrInfo: TableAttrInfo }[],
) => {
  return tables
    .map(({ table, tableInfo, attrInfo }) => {
      return { table: searchTable(searchText, table), tableInfo, attrInfo };
    })
    .filter(({ table }) => {
      return table.length > 1;
    });
};

export { matchID, matchIndex, matchOutcomesItem, searchOutcomes, searchTables };
