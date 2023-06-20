import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ServerItemList } from "../server";

const viewHistoryAtom = atomWithStorage(
  "view_item_list_hidsoty",
  [] as ReadonlyArray<ServerItemList>,
);

const addViewHistoryAtom = atom(null, (get, set, entry: ServerItemList) => {
  if (get(viewHistoryAtom)[0]?.id === entry.id) return;
  const prevHistoryWithoutNew = get(viewHistoryAtom).filter(old => old.id !== entry.id);
  const items = [...entry.items];
  const newEntry = { ...entry, items } as const satisfies ServerItemList;
  set(viewHistoryAtom, [newEntry, ...prevHistoryWithoutNew].slice(0, 100));
});

const useAddViewHistory = () => {
  const add = useSetAtom(addViewHistoryAtom);
  return add;
};

const useViewHistory = () => {
  const viewHistory = useAtomValue(viewHistoryAtom);
  /**
   * append new url entry to view history
   * @param entry
   */
  const add = useSetAtom(addViewHistoryAtom);
  return { viewHistory, add } as const;
};

export { useViewHistory, useAddViewHistory };
