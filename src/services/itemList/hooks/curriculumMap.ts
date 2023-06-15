import { useAtom, useAtomValue, atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";
import { getDefaultSchema } from "@services/itemList/libs/schema";
import { LocalCurriculumMap, ServerItemList } from "@services/itemList/libs/types";

const initialCurriculumMap = {
  items: [],
  data: {},
  from_id: "",
  schema: getDefaultSchema(),
} as LocalCurriculumMap;
const curriculumMapAtom = atomWithStorage("curriculum_map_local", initialCurriculumMap);
// @ts-ignore
const itemsAtom = focusAtom(curriculumMapAtom, optic => optic.prop("items"));
const listDataAtom = focusAtom(curriculumMapAtom, optic => optic.prop("data"));
const curriculumMapToShareAtom = atom(get => {
  const { items, data, schema, from_id } = get(curriculumMapAtom);
  return { items: items.map(item => item.id), data, schema, from_id };
});

const useCurriculumMapItemsValue = () => useAtomValue(itemsAtom);
const useCurriculumMapItems = () => {
  const [itemsInner, setItemsInner] = useAtom(itemsAtom);
  const cloneItems = (items: ReadonlyArray<ServerItemList>) =>
    items.map(item => ({ ...item, items: [...item.items] }));

  const setItems = (items: readonly ServerItemList[]) => {
    setItemsInner(cloneItems(items));
  };
  const addItems = (items: readonly ServerItemList[]) => {
    setItemsInner(prev => cloneItems([...items, ...prev]));
  };
  const clear = () => setItemsInner([]);
  return { items: itemsInner, setItems, addItems, clear };
};

const useCurriculumMapDataValue = () => useAtomValue(listDataAtom);
const useCurriculumMapData = () => {
  const [listData, setListData] = useAtom(listDataAtom);
  const set = (key: string, value: string) => {
    setListData(listData => ({ ...listData, [key]: value }));
  };
  return { listData, set };
};

const useCurriculumMap = () => useAtomValue(curriculumMapAtom);

export {
  useCurriculumMapItems,
  useCurriculumMapItemsValue,
  useCurriculumMap,
  useCurriculumMapDataValue,
  useCurriculumMapData,
  curriculumMapAtom,
  curriculumMapToShareAtom,
};