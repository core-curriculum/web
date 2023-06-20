import { useAtom, useAtomValue, atom, useSetAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { atomWithStorage } from "jotai/utils";
import { arrayEquals, objectEquals } from "@libs/utils";
import { getDefaultSchema, getSchema, validate } from "@services/itemList/libs/schema";
import {
  LocalCurriculumMap,
  ServerCurriculumMap,
  ServerItemList,
  SharedCurriculumMap,
} from "@services/itemList/libs/types";
import { getCurriculuMapFromServer, shareCurriculumMapToServer } from "../local";

const initialCurriculumMap = {
  items: [],
  data: {},
  from_id: "",
  schema: getDefaultSchema(),
} as LocalCurriculumMap;

const initialSharedCurriculumMap: SharedCurriculumMap = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
  id: "",
};

const curriculumMapAtom = atomWithStorage("curriculum_map_local", initialCurriculumMap);
// @ts-ignore
const itemsAtom = focusAtom(curriculumMapAtom, optic => optic.prop("items"));
// @ts-ignore
const listDataAtom = focusAtom(curriculumMapAtom, optic => optic.prop("data"));
const curriculumMapToShareAtom = atom(get => {
  const { items, data, schema, from_id } = get(curriculumMapAtom);
  return { items: items.map(item => item.id), data, schema, from_id };
});

const sharedCurriculumMapAtom = atomWithStorage(
  "curriculum_map_shared",
  initialSharedCurriculumMap,
);
const isCurriculumMapDirtyAtom = atom(
  get => !isCurriculumMapEquals(get(curriculumMapAtom), get(sharedCurriculumMapAtom)),
);

const useCurriculumMapItemsValue = () => useAtomValue(itemsAtom);
const useCurriculumMapItems = () => {
  const [itemsInner, setItemsInner] = useAtom(itemsAtom);
  const cloneItems = (items: ReadonlyArray<ServerItemList>) =>
    items.map(item => ({ ...item, items: [...item.items] }));
  const removeDuplicateEntry = <T>(arr: readonly T[], isSame: (a: T, b: T) => boolean) => {
    return arr.reduce((acc, cur) => {
      if (acc.some(item => isSame(item, cur))) return acc;
      return [...acc, cur];
    }, [] as T[]);
  };

  const setItems = (items: readonly ServerItemList[]) => {
    const newItems = removeDuplicateEntry(cloneItems(items), (a, b) => a.id === b.id);
    setItemsInner(newItems);
  };
  const addItems = (items: readonly ServerItemList[]) => {
    setItemsInner(prev =>
      removeDuplicateEntry([...cloneItems(items), ...prev], (a, b) => a.id === b.id),
    );
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

const useCurricullumMapServerTemplate = () => {
  const setItemList = useSetAtom(curriculumMapAtom);
  const setSharedItemList = useSetAtom(sharedCurriculumMapAtom);
  const apply = async (id: string) => {
    const response = await getCurriculuMapFromServer(id);
    if (!response?.ok) throw new Error(`Cannot find id (${id})`);
    const newItemList = response.data;
    const schema = (await getSchema(newItemList.schema_id)) || getDefaultSchema();
    const from_id = id;
    setItemList({ ...newItemList, schema, from_id });
    setSharedItemList({ ...newItemList, schema, from_id });
  };
  return { apply };
};

const isCurriculumMapEquals = (a: LocalCurriculumMap, b: LocalCurriculumMap) => {
  const res =
    arrayEquals(
      a.items.map(item => item.id),
      b.items.map(item => item.id),
    ) &&
    objectEquals(a.data ?? {}, b.data ?? {}) &&
    (!a.schema?.id || a.schema?.id === b.schema?.id);
  return res;
};

const removeDuplicate = <T>(arr: readonly T[]) => [...new Set(arr)];

const serverCurriculumMapToItemList = (
  serverCurriculumMap: ServerCurriculumMap,
): ServerItemList => {
  const items = removeDuplicate(serverCurriculumMap.items.flatMap(item => item.items));
  const children = serverCurriculumMap.items.map(item => item.id);
  const data = { ...serverCurriculumMap.data };
  return { ...serverCurriculumMap, items, children, data };
};

const useShareCurriculumMap = () => {
  const [sharedCurriculumMap, setSharedCurriculumMap] = useAtom(sharedCurriculumMapAtom);
  const localCurriculumMap = useAtomValue(curriculumMapToShareAtom);
  const schema = localCurriculumMap.schema?.id ? localCurriculumMap.schema?.id : undefined;
  const isDirty = useAtomValue(isCurriculumMapDirtyAtom);
  const share = async () => {
    const inserted = await shareCurriculumMapToServer({
      ...localCurriculumMap,
      schema,
    });
    setSharedCurriculumMap(current => ({ ...current, ...inserted }));
    const itemList = serverCurriculumMapToItemList({ ...sharedCurriculumMap, ...inserted });
    return { insertedAsCurriculumMap: inserted, insertedAsItemList: itemList };
  };
  return { isDirty, share };
};

// @ts-ignore
const curriculumMapSchemaAtom = focusAtom(curriculumMapAtom, optic => optic.prop("schema"));
const curriculumMapValidationResultAtom = atom(get => {
  const item = get(curriculumMapAtom);
  const toValidate = { items: item.items.map(item => item.id), data: item.data };
  return validate(toValidate, get(curriculumMapSchemaAtom));
});
const isCurriculumMapValidAtom = atom(get => get(curriculumMapValidationResultAtom).ok);
const useCurriculumMapSchema = () => {
  const schema = useAtomValue(curriculumMapSchemaAtom);
  const isValid = useAtomValue(isCurriculumMapValidAtom);
  const validationResult = useAtomValue(curriculumMapValidationResultAtom);
  return { schema, isValid, validationResult };
};

export {
  useCurriculumMapItems,
  useCurriculumMapItemsValue,
  useCurriculumMap,
  useCurriculumMapDataValue,
  useCurriculumMapData,
  useCurricullumMapServerTemplate,
  useShareCurriculumMap,
  useCurriculumMapSchema,
  sharedCurriculumMapAtom,
  curriculumMapAtom,
  curriculumMapToShareAtom,
};
