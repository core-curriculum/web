import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { arrayEquals, objectEquals } from "@libs/utils";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { shareCurriculumMapToServer, shareItemListToServer } from "@services/itemList/libs/callApi";
import { getDefaultSchema } from "@services/itemList/libs/schema";
import {
  LocalItemList,
  SharedItemList,
  SharedCurriculumMap,
  LocalCurriculumMap,
  ServerCurriculumMap,
  ServerItemList,
} from "@services/itemList/libs/types";
import { curriculumMapAtom, curriculumMapToShareAtom } from "./curriculumMap";

const initialSharedItemList: SharedItemList = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
  id: "",
};

const initialSharedCurriculumMap: SharedCurriculumMap = {
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

const sharedItemListAtom = atomWithStorage("itemlist_shared", initialSharedItemList);
const isItemListDirtyAtom = atom(get => !isListEquals(get(itemListAtom), get(sharedItemListAtom)));

const sharedCurriculumMapAtom = atomWithStorage(
  "curriculum_map_shared",
  initialSharedCurriculumMap,
);
const isCurriculumMapDirtyAtom = atom(
  get => !isCurriculumMapEquals(get(curriculumMapAtom), get(sharedCurriculumMapAtom)),
);

const removeDuplicate = <T>(arr: readonly T[]) => [...new Set(arr)];

const serverCurriculumMapToItemList = (
  serverCurriculumMap: ServerCurriculumMap,
): ServerItemList => {
  const items = removeDuplicate(serverCurriculumMap.items.flatMap(item => item.items));
  const children = serverCurriculumMap.items.map(item => item.id);
  const data = { ...serverCurriculumMap.data };
  return { ...serverCurriculumMap, items, children, data };
};

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

export { useShare, useShareCurriculumMap, sharedItemListAtom, sharedCurriculumMapAtom };
