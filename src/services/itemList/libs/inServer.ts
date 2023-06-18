import { toBase64, toUUID } from "@libs/uuid_translator";
import { db } from "@services/db";
import type {
  ServerItemList,
  InputItemList,
  ItemListInDB,
  ServerItemListResponse,
  ServerCurriculumMap,
  ItemListDBView,
  InputCurriculumMap,
} from "@services/itemList/libs/types";

const insertData = async (id: string, data: Record<string, string>) => {
  if (Object.entries(data).length === 0) return data;
  const uuid = toUUID(id);
  const entries = Object.entries(data).map(([key, value]) => ({ key, value, item_list: uuid }));
  const { data: response, error } = await db.from("item_list_data").insert(entries).select();
  if (error || !response) throw error ?? new Error("Error inserting item_list_data");
  const res = Object.fromEntries(response.map(({ key, value }) => [key, value]));
  return res;
};

const getData = async (itemListId: string) => {
  const uuid = toUUID(itemListId);
  const { data, error } = await db.from("item_list_data").select().eq("item_list", uuid);
  if (error || !data) throw error ?? new Error("Error in getting item_list_data");
  const res: Record<string, string> = Object.fromEntries(
    data.map(({ key, value }) => [key, value]),
  );
  return res;
};

const serverResponseToItemList = (
  res: ItemListInDB,
  serverData: Record<string, string>,
): ServerItemList => {
  const from_id = res.from_id ? toBase64(res.from_id) : "";
  const schema_id = res.schema_id ? toBase64(res.schema_id) : "";
  const children = res.children?.map(id => toBase64(id)) ?? null;
  const id = toBase64(res.id);
  const data: Record<string, string> = { ...serverData };
  const name = data.name ?? "";
  const place = data.place ?? "";
  return { ...res, id, schema_id, from_id, name, place, data, children };
};

const insertNewList = async ({ data, ...itemList }: InputItemList): Promise<ServerItemList> => {
  const from_uuid = itemList.from_id ? toUUID(itemList.from_id) : undefined;
  const schema_uuid = itemList.schema ? toUUID(itemList.schema) : undefined;
  const children_uuids = itemList.children?.map(id => toUUID(id));
  const { data: inserted, error } = await db
    .from("item_list")
    .insert({
      items: itemList.items,
      from_id: from_uuid,
      schema_id: schema_uuid,
      children: children_uuids,
    })
    .select();
  if (error || !inserted) throw error ?? new Error("Error in insert New List");
  const res = inserted[0] as ItemListInDB;
  const id = toBase64(res.id);
  const insertedData: Record<string, string> = data ? await insertData(id, data) : {};
  return serverResponseToItemList(res, insertedData);
};

const removeDuplicate = <T>(arr: readonly T[]): T[] => {
  const set = new Set(arr);
  return [...set];
};
const insertNewCurriculumMap = async (map: InputCurriculumMap): Promise<ServerCurriculumMap> => {
  const serverItemLists = (await getItemListFromIds(map.items)).flatMap(res =>
    res.ok ? res.data : [],
  );
  const items = removeDuplicate(serverItemLists.flatMap(item => item.items));
  const itemList = { ...map, items, children: map.items };
  const res = await insertNewList(itemList);
  return { ...res, items: serverItemLists };
};

const getCurriculumMapFromId = async (id: string): Promise<ServerCurriculumMap> => {
  const itemList = await getItemListFromId(id);
  const items = (await getItemListFromIds(itemList.children ?? [])).flatMap(res =>
    res.ok ? res.data : [],
  );
  return { ...itemList, items };
};

const getItemListFromId = async (id: string): Promise<ServerItemList> => {
  const list = (await getItemListFromIds([id]))?.[0];
  if (!list || !list.ok) throw new Error(`Cannot find id(${id}) of list.`);
  return list.data;
};

const getItemListFromIds = async (ids: readonly string[]): Promise<ServerItemListResponse[]> => {
  const uuids = ids.map(id => toUUID(id, { ignoreError: true }));
  const { data: response, error } = await db.from("list_view").select().in("id", uuids);
  if (error || !response) throw error ?? new Error("Error in getting itemList");
  return uuids.map(uuid => {
    console.log(JSON.stringify(response, null, 2));
    console.log(uuid);
    const res = response.find(u => u?.id === uuid) as ItemListDBView | undefined;
    if (!res) return { ok: false } as const;
    const data = serverResponseToItemList(res, res.data);
    return {
      ok: true,
      data,
    } as const;
  });
};

export {
  insertNewList,
  getItemListFromId,
  getItemListFromIds,
  insertNewCurriculumMap,
  getCurriculumMapFromId,
};
