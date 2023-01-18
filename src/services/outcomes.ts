import * as path from "path";
import {
  HeaderedTable,
  prefixColumns,
  join,
  selectColumnsByNames,
  renameColumns,
  mapRow,
} from "@libs/tableUtils";
import { mapText } from "@libs/textMapper";
import { tableToTree } from "@libs/treeUtils";
import type { Tree } from "@libs/treeUtils";
import { loadOutcomes } from "@services/loadCsv";
import { outcomeDir } from "@services/paths";
import type { TableInfoDict } from "@services/tables";
import { AttrInfo, getReplaceMap } from "./replaceMap";

const [outcomes_l1_file, outcomes_l2_file, outcomes_l3_file, outcomes_l4_file] = [
  "1",
  "2",
  "3",
  "4",
].map((index) => path.resolve(outcomeDir, `layer${index}.csv`));

const loadFullOutcomesTable = () => {
  const header = [
    "l1_item",
    "l2_item",
    "l3_item",
    "l4_item",
    "l1_id",
    "l2_id",
    "l3_id",
    "l4_id",
    "l1_index",
    "l2_index",
    "l3_index",
    "l4_index",
    "l1_description",
    "l2_description",
    "l1_spell",
  ] as const;
  const renameDict = {
    l2_parent: "l1_id",
    l3_parent: "l2_id",
    l4_parent: "l3_id",
  };
  const [l1, l2, l3, l4] = (["1", "2", "3", "4"] as const).map((layer) => {
    const raw = loadOutcomes(layer);
    const data = prefixColumns(raw, `l${layer}_`);
    return renameColumns(data, renameDict);
  });
  const l12 = join(l1, l2, { on: "l1_id", nan: "", how: "right" });
  const l123 = join(l12, l3, { on: "l2_id", nan: "", how: "right" });
  const l1234 = join(l123, l4, { on: "l3_id", nan: "", how: "right" });
  return selectColumnsByNames(l1234, header);
};


type OutcomeBasicInfo = {
  text: string;
  id: string;
  index: string;
};
type Outcomel1 = {
  layer: "l1";
  desc: string;
  spell: string;
} & OutcomeBasicInfo;
type Outcomel2 = {
  layer: "l2";
  desc: string;
} & OutcomeBasicInfo;
type Outcomel3 = {
  layer: "l3";
  attrInfo?: { gap: number; length: number; info: AttrInfo }[];
} & OutcomeBasicInfo;
type Outcomel4 = {
  layer: "l4";
  attrInfo?: { gap: number; length: number; info: AttrInfo }[];
} & OutcomeBasicInfo;
type OutcomeInfo = Outcomel4 | Outcomel3 | Outcomel2 | Outcomel1;
type OutcomeRow = {
  l1: Outcomel1;
  l2: Outcomel2;
  l3: Outcomel3;
  l4: Outcomel4;
};

const makeMappedOutcomesTable = (
  fullOutcomesTable: HeaderedTable<string>,
  infoDict: TableInfoDict,
) => {
  const map = getReplaceMap(infoDict);

  return mapRow(fullOutcomesTable, (row) => {
    const { text: l4text, infoList: l4AttrInfo } = mapText(row["l4_item"], map);
    const { text: l3text, infoList: l3AttrInfo } = mapText(row["l3_item"], map);
    const newRow: OutcomeRow = {
      l1: {
        layer: "l1",
        text: row["l1_item"],
        id: row["l1_id"],
        desc: row["l1_description"],
        index: row["l1_index"],
        spell: row["l1_spell"],
      },
      l2: {
        layer: "l2",
        text: row["l2_item"],
        id: row["l2_id"],
        desc: row["l2_description"],
        index: row["l2_index"],
      },
      l3: {
        layer: "l3",
        text: l3text,
        id: row["l3_id"],
        index: row["l3_index"],
      },
      l4: {
        layer: "l4",
        text: l4text,
        id: row["l4_id"],
        index: row["l4_index"],
      },
    };
    if (l4AttrInfo?.length > 0) newRow.l4.attrInfo = l4AttrInfo;
    if (l3AttrInfo?.length > 0) newRow.l3.attrInfo = l3AttrInfo;
    return newRow;
  });
};

const makeOutcomesTree = (fullOutcomesTable: HeaderedTable<string>, infoDict: TableInfoDict) => {
  const [, ...table] = makeMappedOutcomesTable(fullOutcomesTable, infoDict);
  return tableToTree(table, (u1, u2) => u1.id === u2.id) as Tree<OutcomeInfo>;
};

export { loadFullOutcomesTable, makeMappedOutcomesTable, makeOutcomesTree };
export type { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomeInfo };
