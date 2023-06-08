import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { arrayEquals, objectEquals } from "@libs/utils";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { shareCurriculumMapToServer, shareItemListToServer } from "@services/itemList/libs/callApi";
import { getDefaultSchema } from "@services/itemList/libs/schema";
import { LocalItemList, SharedItemList } from "@services/itemList/libs/types";
import { curriculumMapToShareAtom } from "./curriculumMap";

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

const sharedCurriculumMapAtom = atomWithStorage("curriculum_map_shared", initialSharedItemList);
const isCurriculumMapDirtyAtom = atom(
  get => !isListEquals(get(curriculumMapToShareAtom), get(sharedCurriculumMapAtom)),
);

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
  const setSharedCurriculumMap = useSetAtom(sharedCurriculumMapAtom);
  const localCurriculumMap = useAtomValue(curriculumMapToShareAtom);
  const schema = localCurriculumMap.schema?.id ? localCurriculumMap.schema?.id : undefined;
  const isDirty = useAtomValue(isCurriculumMapDirtyAtom);
  const share = async () => {
    const inserted = await shareCurriculumMapToServer({
      ...localCurriculumMap,
      schema,
    });
    setSharedCurriculumMap(current => ({ ...current, ...inserted }));
    return inserted;
  };
  return { isDirty, share };
};

export { useShare, useShareCurriculumMap, sharedItemListAtom };
