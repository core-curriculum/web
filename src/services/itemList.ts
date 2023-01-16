
type ItemList = {
  id: string;
  items: readonly string[];
  ex_data: Record<string, string>;
  schema_id: string;
}

type InputItemList = Pick<ItemList, "items"> & Partial<Pick<ItemList, "ex_data" | "schema_id">>
type ServerItemList = Pick<ItemList, "items" | "id" | "schema_id" | "ex_data"> & {
  created_at: Date,
}

export type { ItemList, InputItemList, ServerItemList }
