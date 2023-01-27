
import { toBase64, toUUID } from '@libs/uuid_translator';
import { db } from '@services/db'
import type { ServerItemList, InputItemList, ItemListInDB } from '@services/itemList/types';

const insertExData = async (id: string, exData: Record<string, string>) => {
  if (Object.entries(exData).length === 0) return exData;
  const uuid = toUUID(id);
  const entries = Object.entries(exData).map(([key, value]) => ({ key, value, item_list: uuid }))
  const { data, error } = await db
    .from('ex_data')
    .insert(entries)
    .select()
  if (error || !data) throw error ?? new Error("Error inserting ex_data");
  const res = Object.fromEntries(data.map(({ key, value }) => [key, value]));
  return res;
}

const getExData = async (itemListId: string) => {
  const uuid = toUUID(itemListId);
  const { data, error } = await db
    .from('ex_data')
    .select()
    .eq("item_list", uuid)
  if (error || !data) throw error ?? new Error("Error in getting itemList");
  const res: Record<string, string> = Object.fromEntries(
    data.map(({ key, value }) => [key, value])
  );
  return res;
}

const insertNewList = async ({ ex_data, ...itemList }: InputItemList): Promise<ServerItemList> => {
  const { data, error } = await db
    .from('item_list')
    .insert(itemList)
    .select()
  if (error || !data) throw error ?? new Error("Error in insert New List");
  const res = data[0] as ItemListInDB;
  const { id, from = "", schema_id = "", ...rest } = { ...res, id: toBase64(res.id) };
  const insertedExData: Record<string, string> = ex_data
    ? await insertExData(id, ex_data)
    : {};
  return { id, from, schema_id, ...rest, ex_data: insertedExData };
}

const getItemListFromId = async (id: string): Promise<ServerItemList> => {
  const uuid = toUUID(id);
  const { data, error } = await db
    .from('item_list')
    .select()
    .eq("id", uuid)
  if (error || !data) throw error ?? new Error("Error in getting itemList");
  const res = data[0] as ItemListInDB;
  const { from = "", schema_id = "" } = res;
  const ex_data = await getExData(id);
  return { ...res, ex_data, id, from, schema_id }
}

export { insertNewList, getItemListFromId }