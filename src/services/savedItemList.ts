import { atom, useAtom } from "jotai";
import * as localforage from "localforage";
import { startTransition } from "react";

const SavedItemListKey = "SavedItemList"
const namespace = "core-curriculum"
const store = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: namespace,
  storeName: SavedItemListKey,
  version: 1
})

type AsyncStorage<T> = {
  getItem: (key: string) => Promise<T | null>;
  setItem: (key: string, value: T) => Promise<unknown>;
}
const atomWithAsyncStorage = <T>(key: string, initialValue: T, store: AsyncStorage<T>) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ; (async () => {
      const item = await store.getItem(key) ?? initialValue;
      startTransition(() => {
        setValue(item)

      })
    })()
  }
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      store.setItem(key, nextValue)
    }
  )
  return derivedAtom
}

type SavedItemList = {
  ids: string[]
}
const defaultSavedItemList: SavedItemList = {
  ids: []
}

const savedItemListAtom = atomWithAsyncStorage<SavedItemList>(
  SavedItemListKey, defaultSavedItemList, store
);

const useSavedItemList = () => {
  const [itemList, setItemList] = useAtom(savedItemListAtom);
  const ids: ReadonlyArray<string> = itemList.ids;
  const addId = (id: string) => {
    if (itemList.ids.includes(id)) {
      return false;
    } else {
      const newList = { ...itemList, ids: [...ids, id] };
      setItemList(newList);
      return true;
    }

  }
  const removeId = (id: string) => {
    if (itemList.ids.includes(id)) {
      const newList = { ...itemList, ids: ids.filter(item => item !== id) };
      setItemList(newList);
      return true;
    } else {
      return false;
    }

  }
  return { ids, addId, removeId }
}

export { useSavedItemList }