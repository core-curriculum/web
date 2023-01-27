
type SchemaUnit = {
  type: "text",
  required: boolean,
  key: string,
  label: string,
}

type Schema = { id: string, items: readonly SchemaUnit[], allowEmpty: boolean };

type ItemList = {
  id: string;
  items: readonly string[];
  ex_data: Record<string, string>;
  schema_id: string;
  from: string;
}

type Expand<T> = { [K in keyof T]: T[K] };
type InputItemList = Expand<
  Pick<ItemList, "items"> &
  Partial<Pick<ItemList, "ex_data" | "schema_id" | "from">>
>
type ServerItemList = Expand<
  ItemList &
  {
    created_at: Date,
  }
>

type ItemListInDB = Expand<
  Pick<ItemList, "items" | "id"> &
  Partial<Pick<ItemList, "schema_id" | "from">> &
  {
    created_at: Date,
  }
>

type LocalItemList = Expand<
  Pick<ItemList, "items" | "from"> & Partial<Pick<ItemList, "ex_data">> & { schema: Schema }
>
type SharedItemList = Expand<Omit<ItemList, "schema_id"> & { schema: Schema }>


export type {
  ItemList,
  InputItemList, ServerItemList, ItemListInDB, LocalItemList, Schema, SchemaUnit, SharedItemList
}
