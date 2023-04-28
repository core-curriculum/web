import { useAtom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";
import { getDefaultSchema } from "@services/itemList/libs/schema";
import { LocalItemList } from "@services/itemList/libs/types";

const initialItemList: LocalItemList = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
};
const itemListAtom = atomWithStorage("itemlist_local", initialItemList);
const itemsAtom = focusAtom(itemListAtom, optic => optic.prop("items"));
const listDataAtom = focusAtom(itemListAtom, optic => optic.prop("data"));

const useItemsValue = () => useAtomValue(itemsAtom);
const useItems = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const add = (id: string) => {
    setItems(items => [...new Set(items).add(id)]);
  };
  const remove = (id: string) => {
    setItems(items => {
      const set = new Set(items);
      set.delete(id);
      return [...set];
    });
  };
  const clear = () => setItems([]);
  return { items, add, remove, clear };
};

const useListDataValue = () => useAtomValue(listDataAtom);
const useListData = () => {
  const [listData, setListData] = useAtom(listDataAtom);
  const set = (key: string, value: string) => {
    setListData(listData => ({ ...listData, [key]: value }));
  };
  return { listData, set };
};

const useItemList = () => useAtomValue(itemListAtom);

export { useItems, useItemsValue, useItemList, useListDataValue, useListData, itemListAtom };
