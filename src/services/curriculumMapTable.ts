import { toObjectList } from "@libs/tableUtils";
import { reduceTree, Tree } from "@libs/treeUtils";
import { ServerItemList } from "@services/itemList/server";
import { OutcomeInfo } from "@services/outcomes";
import { TableInfoSet } from "@services/tables";

type LabelInfo = {
  index: string;
  label: string;
  ids: string[];
};

const makelayerLabels = (tree: Tree<OutcomeInfo>, depth: 1 | 2 | 3 | 4) => {
  return reduceTree<OutcomeInfo, LabelInfo>(tree, (item, children, parents) => {
    const currentDepth = parents.length + 1;
    const info = { index: item.index, label: item.text, ids: [item.id] };
    if (currentDepth >= depth) {
      info.ids = [...info.ids, ...children.flat().flatMap(c => c.ids)];
      return [info];
    }
    return [info, ...children.flat()];
  });
};

const makeTableLabels = (tables: TableInfoSet[]) => {
  return tables.map(table => {
    const { id, index, item: label } = table.tableInfo;
    const ids = [id, ...toObjectList(table.table).map(item => (item as { id: string }).id)];
    return { index, label, ids };
  });
};

const makeTableItemLabels = (tables: TableInfoSet[]) => {
  return tables.flatMap(table => {
    const { id, index, item: label, columns } = table.tableInfo;
    const head = { index, label, ids: [id] };

    const rows = toObjectList(table.table).map(item => {
      const _item = item as { index: string; id: string } & { [key: string]: string };
      return { index, id: _item["id"] as string, item: _item[columns["item"]] as string };
    });
    return [head, ...rows.map(row => ({ index: row.index, label: row.item, ids: [row.id] }))];
  });
};

const makeTableData = (items: ServerItemList[], labels: LabelInfo[]) => {
  const header = [
    ["", "", ...items.map(item => item.name)],
    ["", "", ...items.map(item => item.place)],
  ];

  const body = labels.map(label => {
    const row = [
      label.index,
      label.label,
      ...items.map(item => {
        const ids = item.items;
        return label.ids.some(id => ids.includes(id)) ? "○" : "";
      }),
    ];
    return row;
  });
  return [...header, ...body];
};

const makeOutcomeTableData = (
  items: ServerItemList[],
  tree: Tree<OutcomeInfo>,
  depth: 1 | 2 | 3 | 4,
) => {
  const labels = makelayerLabels(tree, depth);
  return makeTableData(items, labels);
};

const makeTableTableData = (items: ServerItemList[], tables: TableInfoSet[]) => {
  const labels = makeTableLabels(tables);
  return makeTableData(items, labels);
};

const makeTableItemTableData = (items: ServerItemList[], tables: TableInfoSet[]) => {
  const labels = makeTableItemLabels(tables);
  return makeTableData(items, labels);
};

export { makeOutcomeTableData, makeTableTableData, makeTableItemTableData };
