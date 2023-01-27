import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils"
import { arrayEquals, objectEquals } from "@libs/utils";
import {
  getDefaultSchema, validate as validateWithSchema, schemaItemsWithValue
} from "@services/itemList/schema";
import { getItemListFromServer, shareItemListToServer } from "@services/itemList/server";
import { LocalItemList, SharedItemList } from "@services/itemList/types";
import { getSchema } from "@services/schema";

const initialItemList: LocalItemList = {
  items: [],
  ex_data: {},
  schema: getDefaultSchema(),
  from: ""
};
const initialSharedItemList: SharedItemList = {
  items: [],
  ex_data: {},
  schema: getDefaultSchema(),
  from: "",
  id: "",
};

const isListEquals = (a: LocalItemList, b: LocalItemList) => {
  return arrayEquals(a.items, b.items) &&
    objectEquals(a.ex_data ?? {}, b.ex_data ?? {}) &&
    a.schema.id === b.schema.id;
}

const localItemListAtom = atomWithStorage("itemlist_local", initialItemList);
const sharedItemListAtom = atomWithStorage("itemlist_shared", initialSharedItemList);
const itemsAtom = focusAtom(localItemListAtom, (optic) => optic.prop("items"));
const exDataAtom = focusAtom(localItemListAtom, (optic) => optic.prop("ex_data"));
const isDirtyAtom = atom((get) => !isListEquals(get(localItemListAtom), get(sharedItemListAtom)));
const schemaAtom = focusAtom(localItemListAtom, optic => optic.prop("schema"));
const schemaWithValueAtom = atom(
  get => schemaItemsWithValue(get(localItemListAtom), get(schemaAtom)))
const validationResultAtom = atom(
  get => validateWithSchema(get(localItemListAtom), get(schemaAtom)));
const isValidAtom = atom(get => get(validationResultAtom).ok);

const useItemsValue = () => useAtomValue(itemsAtom);
const useItems = () => {
  const [items, setItems] = useAtom(itemsAtom);
  const add = (id: string) => {
    setItems((items) => [...new Set(items).add(id)]);
  }
  const remove = (id: string) => {
    setItems((items) => {
      const set = new Set(items);
      set.delete(id);
      return [...set];
    })
  }
  const clear = () => setItems([]);
  return { items, add, remove, clear };
}

const useExDataValue = () => useAtomValue(exDataAtom);
const useExData = () => {
  const [exData, setExData] = useAtom(exDataAtom);
  const set = (key: string, value: string) => {
    setExData((exData) => ({ ...exData, [key]: value }));
  }
  return { exData, set };
}

const useItemList = () => useAtomValue(localItemListAtom);

const useShare = () => {
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const localItemList = useAtomValue(localItemListAtom);
  const isDirty = useAtomValue(isDirtyAtom);
  const share = async () => {
    const inserted = await shareItemListToServer(localItemList);
    setSharedItemList((current) => ({ ...current, ...inserted }));
    return inserted;
  }
  return { isDirty, share }
}

const useSchema = () => {
  const schema = useAtomValue(schemaAtom);
  const isValid = useAtomValue(isValidAtom);
  const validationResult = useAtomValue(validationResultAtom);
  return { schema, isValid, validationResult }
}

const useSchemaWithValue = () => {
  const schemaWithValue = useAtomValue(schemaWithValueAtom);
  const { set: setExData } = useExData()
  const set = (key: string, value: string) => setExData(key, value);
  return { schemaWithValue, set }
}

const useServerTemplate = () => {
  const setItemList = useSetAtom(localItemListAtom);
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const apply = async (id: string) => {
    const newItemList = await getItemListFromServer(id);
    if (!newItemList) throw new Error(`Cannot find id (${id})`);
    const schema = await getSchema(newItemList.id) ?? getDefaultSchema();
    setItemList({ schema, ...newItemList });
    setSharedItemList({ schema, ...newItemList });
  }
  return { apply }
}


export {
  useItems,
  useItemsValue,
  useItemList,
  getItemListFromServer,
  useSchema,
  useShare,
  useSchemaWithValue,
  useServerTemplate,
  useExDataValue,
  useExData
}