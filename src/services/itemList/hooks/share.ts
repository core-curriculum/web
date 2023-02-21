import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { arrayEquals, objectEquals } from "@libs/utils";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { shareItemListToServer } from "@services/itemList/libs/callApi";
import { getDefaultSchema } from "@services/itemList/libs/schema";
import { LocalItemList, SharedItemList } from "@services/itemList/libs/types";

const initialSharedItemList: SharedItemList = {
  items: [],
  data: {},
  schema: getDefaultSchema(),
  from_id: "",
  id: "",
};

const isListEquals = (a: LocalItemList, b: LocalItemList) => {
  return (
    arrayEquals(a.items, b.items) &&
    objectEquals(a.data ?? {}, b.data ?? {}) &&
    a.schema?.id === b.schema?.id
  );
};

const sharedItemListAtom = atomWithStorage("itemlist_shared", initialSharedItemList);
const isDirtyAtom = atom(get => !isListEquals(get(itemListAtom), get(sharedItemListAtom)));

const useShare = () => {
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const localItemList = useAtomValue(itemListAtom);
  const schema = localItemList.schema?.id ? localItemList.schema?.id : undefined;
  const isDirty = useAtomValue(isDirtyAtom);
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

export { useShare, sharedItemListAtom };
