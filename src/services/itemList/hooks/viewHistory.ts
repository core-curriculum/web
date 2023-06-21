import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ServerItemList } from "../server";

const viewHistoryAtom = atomWithStorage(
  "view_item_list_hidsoty",
  [] as ReadonlyArray<ServerItemList>,
);

let mounted = false;

viewHistoryAtom.onMount = () => {
  mounted = true;
};

const useViewHistory = () => {
  const [viewHistory, setViewHistoryAtom] = useAtom(viewHistoryAtom);
  /**
   * append new url entry to view history
   * @param entry
   */
  const add = (entry: ServerItemList) => {
    if (!mounted) return viewHistory;
    setViewHistoryAtom(viewHistory => {
      console.log(viewHistory);
      if (viewHistory[0]?.id === entry.id) return viewHistory;
      const prevHistoryWithoutNew = viewHistory.filter(old => old.id !== entry.id);
      const items = [...entry.items];
      const newEntry = { ...entry, items } as const satisfies ServerItemList;
      return [newEntry, ...prevHistoryWithoutNew].slice(0, 100);
    });
  };
  return { viewHistory, add } as const;
};

export { useViewHistory };
