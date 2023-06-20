import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";
import { arrayEquals, objectEquals } from "@libs/utils";
import { getDefaultSchema, getSchema, validate } from "@services/itemList/libs/schema";
import { LocalItemList, SharedItemList } from "@services/itemList/libs/types";
import { getItemListFromServer, shareItemListToServer } from "../local";

const initialItemList: LocalItemList = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
};
const itemListAtom = atomWithStorage("itemlist_local", initialItemList);
// @ts-ignore
const itemsAtom = focusAtom(itemListAtom, optic => optic.prop("items"));
const listDataAtom = focusAtom(itemListAtom, optic => optic.prop("data"));

const useItemsValue = () => useAtomValue(itemsAtom);
const useItems = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const add = (id: string) => {
    setItems((items: readonly string[]) => [...new Set(items).add(id)]);
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

const useServerTemplate = () => {
  const setItemList = useSetAtom(itemListAtom);
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const apply = async (id: string) => {
    const response = (await getItemListFromServer([id]))?.[0];
    if (!response?.ok) throw new Error(`Cannot find id (${id})`);
    const newItemList = response.data;
    newItemList.children = null;
    const schema = (await getSchema(newItemList.schema_id)) || getDefaultSchema();
    const from_id = id;
    setItemList({ ...newItemList, schema, from_id });
    setSharedItemList({ ...newItemList, schema, from_id });
  };
  return { apply };
};

const initialSharedItemList: SharedItemList = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
  id: "",
};

const isListEquals = (a: LocalItemList, b: LocalItemList) => {
  const res =
    arrayEquals(a.items, b.items) &&
    objectEquals(a.data ?? {}, b.data ?? {}) &&
    (!a.schema?.id || a.schema?.id === b.schema?.id);
  return res;
};

const sharedItemListAtom = atomWithStorage("itemlist_shared", initialSharedItemList);
const isItemListDirtyAtom = atom(get => !isListEquals(get(itemListAtom), get(sharedItemListAtom)));

const useShare = () => {
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const localItemList = useAtomValue(itemListAtom);
  const schema = localItemList.schema?.id ? localItemList.schema?.id : undefined;
  const isDirty = useAtomValue(isItemListDirtyAtom);
  const share = async () => {
    const inserted = await shareItemListToServer({
      ...localItemList,
      schema,
    });
    setSharedItemList(current => ({ ...current, ...inserted }));
    return inserted;
  };
  return { isDirty, share };
};

// @ts-ignore
const itemListSchemaAtom = focusAtom(itemListAtom, optic => optic.prop("schema"));
const itemListValidationResultAtom = atom(get =>
  validate(get(itemListAtom), get(itemListSchemaAtom)),
);
const isItemListValidAtom = atom(get => get(itemListValidationResultAtom).ok);

const useItemListSchema = () => {
  const schema = useAtomValue(itemListSchemaAtom);
  const isValid = useAtomValue(isItemListValidAtom);
  const validationResult = useAtomValue(itemListValidationResultAtom);
  return { schema, isValid, validationResult };
};

export {
  useItems,
  useItemsValue,
  useItemList,
  useListDataValue,
  useListData,
  useShare,
  useItemListSchema,
  itemListAtom,
  useServerTemplate,
};
