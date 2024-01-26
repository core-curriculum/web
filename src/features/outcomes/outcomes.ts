import { mapTree, type Tree } from "@libs/treeUtils";
import { AttrInfo } from "./attrInfo";
import { Locale } from "@locales/index";

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

const loadIdTree = async (locale: Locale) => {
  return (locale === "ja"
    ? (await import(`json_in_repo/outcomes/ja/outcome_tree.json`)).default
    : (await import(`json_in_repo/outcomes/en/outcome_tree.json`))
        .default) as unknown as Tree<string>;
};

const loadAttrInfo = async (locale: Locale) => {
  return (
    locale === "ja"
      ? (await import(`json_in_repo/outcomes/ja/attr_info.json`)).default
      : (await import(`json_in_repo/outcomes/en/attr_info.json`)).default
  ) as {
    [key: string]: { [item: string]: { info: AttrInfo; gap: number; length: number }[] };
  };
};

const loadIdDict = async (locale: Locale) => {
  return Object.fromEntries(
    locale === "ja"
      ? (await import(`json_in_repo/outcomes/ja/id_list.json`)).default
      : (await import(`json_in_repo/outcomes/en/id_list.json`)).default,
  );
};

const loadOutcomesTree = async (locale: Locale) => {
  const idTree = await loadIdTree(locale);
  const attrInfo = await loadAttrInfo(locale);
  const idDict = await loadIdDict(locale);
  return mapTree(idTree, id => {
    const { type, ...item } = idDict[id];
    const info = attrInfo[id]?.item;
    const layer = type as "l1" | "l2" | "l3" | "l4";
    const outcomeInfo: OutcomeInfo = { layer, id, ...item };
    if (info && (outcomeInfo.layer === "l4" || outcomeInfo.layer === "l3")) {
      outcomeInfo.attrInfo = info;
    }
    return outcomeInfo;
  });
};

export { loadOutcomesTree };
export type { Outcomel1, Outcomel2, Outcomel3, Outcomel4, OutcomeInfo };
