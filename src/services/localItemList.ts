import { atom, useAtom, useAtomValue } from "jotai";
import * as localforage from "localforage";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import { startTransition } from "react";
import useSWR from 'swr'
import { arrayEquals, objectEquals } from "@libs/utils";
import { ItemList, ServerItemList } from "./itemList";
import { getSchema, isValid as isValidWithSchema, schemaItemsWithValue } from "./schema";
import { InputItemList } from "./serverItemList";

const localItemListKey = "localItemList"
const namespace = "core-curriculum"
const store = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: namespace,
  storeName: localItemListKey,
  version: 1
})

const idToListUrl = (id: string) => {
  const url = new URL(window.location.href);
  return `${url.origin}/x/${id}`;
};



type AsyncStorage<T> = {
  getItem: (key: string) => Promise<T | null>;
  setItem: (key: string, value: T) => Promise<unknown>;
}
type StragedItem = {
  [key: string]: unknown
}
const atomsWithAsyncStorage = <T extends StragedItem>(
  initialValue: T, store: AsyncStorage<T[string]>) => {
  const baseAtom = atom(initialValue)
  baseAtom.onMount = (setValue) => {
    ; (async () => {
      const entries = Object.entries(
        initialValue).map(async ([key, init]) => [key, await store.getItem(key) ?? init] as const)
      const items = Object.fromEntries(await Promise.all(entries)) as T;
      setValue(items)
    })()
  }
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T | ((prev: T) => T)) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update
      set(baseAtom, nextValue)
      Object.entries(nextValue).forEach(([key, value]) => store.setItem(key, value as T[string]))
    }
  )
  return derivedAtom
}

const atomWithAsyncStorage = <T>(key: string, initialValue: T, store: AsyncStorage<T>) => {
  const baseAtom = atom<T>(initialValue)
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

type LocalItemList = Pick<ItemList, "items"> & Partial<Pick<ItemList, "ex_data" | "schema_id">>

const defaultLocalItemList: LocalItemList = {
  items: [],
  ex_data: {},
}


const shareItemListToServer = async (itemList: InputItemList): Promise<ServerItemList> => {
  const posted = await fetch("/api/v1/itemList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemList),
  });
  if (posted.ok) {
    const inserted = await posted.json();
    return inserted;
  }
  throw new Error("Fail to share itemList.");
};

const getItemListFromServer = async (id: string): Promise<ServerItemList> => {
  const params = new URLSearchParams({ id })
  const res = await fetch(`/api/v1/itemList?${params}`, {
    method: "GET",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error("Fail to get itemList.");
};


const isListEquals = (a: LocalItemList, b: LocalItemList) => {
  return arrayEquals(a.items, b.items) &&
    objectEquals(a.ex_data ?? {}, b.ex_data ?? {}) &&
    a.schema_id === b.schema_id;
}

const localItemListAtom = atomWithAsyncStorage<LocalItemList>(
  localItemListKey, defaultLocalItemList, store
);
const sharedItemListAtom = atomWithAsyncStorage<ItemList | null>(
  "sharedItemListAtom", null, store
)
const schemaAtom = atom((get) => {
  console.log(`schemaAtom derived localItemListAtom ${localItemListAtom}`)
  //const schemaId = get(localItemListAtom)?.schema_id;
  return getSchema("")
});
const isValidAtom = atom((get) => {
  return isValidWithSchema(get(localItemListAtom), get(schemaAtom));
})
const isDirtyAtom = atom((get) => {
  const sharedItemList = get(sharedItemListAtom);
  if (!sharedItemList) return true;
  return !isListEquals(sharedItemList, get(localItemListAtom));
})


const useServerItemList = (id: string) => {
  return useSWR<ServerItemList, Error>(id, getItemListFromServer);
}


const useShare = () => {
  const [sharedItemList, setSharedItemList] = useAtom(sharedItemListAtom);
  const [localItemList] = useAtom(localItemListAtom);
  const isDirty = sharedItemList ? !isListEquals(sharedItemList, localItemList) : true;
  const share = async () => {
    if (sharedItemList === null || isDirty) {
      const inserted = await shareItemListToServer(localItemList);
      setSharedItemList(inserted);
      return inserted;
    } else {
      return sharedItemList;
    }
  }
  return { isDirty, share }
}


const useSchema = () => {
  const [itemList] = useAtom(localItemListAtom);
  const schema = useAtomValue(schemaAtom);
  const isValid = isValidWithSchema(itemList, schema);
  const schemaWithValue = schemaItemsWithValue(itemList, schema);
  return { schema, isValid, schemaWithValue }
}

const useServerTemplate = () => {
  const [, setItemList] = useAtom(localItemListAtom);
  const [, setSharedItemList] = useAtom(sharedItemListAtom);
  const apply = async (id: string) => {
    const newItemList = await getItemListFromServer(id);
    if (!newItemList) throw new Error(`Cannot find id (${id})`)
    setItemList(newItemList);
    setSharedItemList(newItemList);

  }
  return { apply }
}

const useLocalItemList = () => {
  const [itemList, setItemList] = useAtom(localItemListAtom);
  const { share, isDirty } = useShare();
  const items: ReadonlyArray<string> = itemList.items;
  const exData: Record<string, string> = itemList.ex_data ?? {};

  const addItem = (item: string) => {
    if (itemList.items.includes(item)) {
      return false;
    } else {
      const newList = { ...itemList, items: [...items, item] };
      setItemList(newList);
      return true;
    }
  }
  const removeItem = (item: string) => {
    if (itemList.items.includes(item)) {
      const newList = { ...itemList, items: items.filter(i => i !== item) };
      setItemList(newList);
      return true;
    } else {
      return false;
    }

  }
  const setExData = (newData: Record<string, string>) => {
    const newList = { ...itemList, ex_data: { ...newData } };
    setItemList(newList);
  }
  const setExDataValue = (key: string, value: string) => {
    setExData({ ...exData, [key]: value })
  }
  return {
    items, addItem, removeItem, share,
    setExData, exData, isDirty,
    setExDataValue
  }
}

export {
  useLocalItemList, getItemListFromServer, useServerItemList, idToListUrl, useSchema, useShare,
  useServerTemplate
}