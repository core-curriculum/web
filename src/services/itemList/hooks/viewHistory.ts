import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type ViewHistory = {
  readonly url: string;
  readonly timestamp: Date;
}[];

const viewHistoryAtom = atomWithStorage("view_item_list_hidsoty", [] as ViewHistory);
const appendViewHistoryAtom = atom(null,(get, set, newUrl:string) => {
  const prevHistory = get(viewHistoryAtom).filter(entry=>entry.url!==newUrl);
  const newEntry = {url:newUrl,timestamp:new Date()} as const satisfies ViewHistory[number];
  set(viewHistoryAtom,[newEntry,...prevHistory]);
});

const useViewHistory = ()=>{
  const viewHistory = useAtomValue(viewHistoryAtom);
  const append = useSetAtom(appendViewHistoryAtom);
  return {viewHistory,append} as const;
}

export {useViewHistory};
