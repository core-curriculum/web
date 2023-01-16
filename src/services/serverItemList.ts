
import { createClient } from '@supabase/supabase-js'
import { toBase64, toUUID } from '@libs/uuid_translator';
import type { ItemList, ServerItemList, InputItemList } from './itemList';

const SUPA_BASE_URL = process.env.SUPABASE_URL ?? "";
const SUPA_BASE_KEY = process.env.SUPABASE_KEY ?? "";
const supabase = createClient(SUPA_BASE_URL, SUPA_BASE_KEY);

type ItemListInDB = Pick<ItemList, "items" | "id" | "schema_id"> & {
  created_at: Date,
}

const insertExData = async (id: string, exData: Record<string, string>) => {
  if (Object.entries(exData).length === 0) return exData;
  const uuid = toUUID(id);
  const entries = Object.entries(exData).map(([key, value]) => ({ key, value, item_list: uuid }))
  const { data, error } = await supabase
    .from('ex_data')
    .insert(entries)
    .select()
  if (error || !data) throw error ?? new Error("Error inserting ex_data");
  const res = Object.fromEntries(data.map(({ key, value }) => [key, value]));
  return res;
}

const getExData = async (itemListId: string) => {
  const uuid = toUUID(itemListId);
  const { data, error } = await supabase
    .from('ex_data')
    .select()
    .eq("item_list", uuid)
  if (error || !data) throw error ?? new Error("Error in getting itemList");
  const res: Record<string, string> = Object.fromEntries(
    data.map(({ key, value }) => [key, value])
  );
  return res;
}


const insertNewList = async ({ items, schema_id, ex_data }: InputItemList) => {
  const { data, error } = await supabase
    .from('item_list')
    .insert({ items, schema_id })
    .select()
  if (error || !data) throw error ?? new Error("Error in insert New List");
  const res = data[0] as ItemListInDB;
  const newList = { ...res, id: toBase64(res.id) };
  const insertedExData: Record<string, string> = ex_data
    ? await insertExData(newList.id, ex_data)
    : {};
  return { ...newList, ex_data: insertedExData };
}

const getItemListFromId = async (id: string): Promise<ServerItemList> => {
  const uuid = toUUID(id);
  const { data, error } = await supabase
    .from('item_list')
    .select()
    .eq("id", uuid)
  if (error || !data) throw error ?? new Error("Error in getting itemList");
  const res = data[0] as ItemListInDB;
  const ex_data = await getExData(id);
  return { ...res, ex_data, id: toBase64(res.id) }
}

export type { ItemListInDB, InputItemList }
export { insertNewList, getItemListFromId }