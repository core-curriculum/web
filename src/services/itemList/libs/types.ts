import { Schema, SchemaUnit } from "@services/itemList/libs/schema";

type ItemList = {
  id: string;
  items: readonly string[];
  data: Record<string, string>;
  schema_id: string;
  from_id: string;
};

type Expand<T> = { [K in keyof T]: T[K] };
type InputItemList = Expand<
  Pick<ItemList, "items"> & Partial<Pick<ItemList, "data" | "from_id"> & { schema: string }>
>;
type ServerItemList = Expand<
  ItemList & {
    created_at: Date;
  }
>;

type ItemListInDB = Expand<
  Pick<ItemList, "items" | "id"> &
    Partial<Pick<ItemList, "schema_id" | "from_id">> & {
      created_at: Date;
    }
>;

type ItemListDBView = Readonly<{
  id: string;
  items: readonly string[];
  created_at: Date;
  data: Record<string, string>;
  schema_id?: string;
  from_id?: string;
}>;
type ServerItemListResponse =
  | {
      ok: true;
      data: ServerItemList;
    }
  | { ok: false };

type LocalItemList = Expand<
  Pick<ItemList, "items" | "from_id"> & Partial<Pick<ItemList, "data">> & { schema: Schema }
>;
type SharedItemList = Expand<Omit<ItemList, "schema_id"> & { schema: Schema }>;

export type {
  ItemList,
  InputItemList,
  ServerItemList,
  ItemListInDB,
  ServerItemListResponse,
  ItemListDBView,
  LocalItemList,
  Schema,
  SchemaUnit,
  SharedItemList,
};
