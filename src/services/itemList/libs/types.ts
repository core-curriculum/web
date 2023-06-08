import { Schema, SchemaUnit } from "@services/itemList/libs/schema";

type ItemList = {
  id: string;
  items: readonly string[];
  data: Record<string, string>;
  schema_id: string;
  from_id: string;
  children?: readonly string[];
};

type Expand<T> = { [K in keyof T]: T[K] };
type InputItemList = {
  items: readonly string[];
  children?: readonly string[];
  data?: Record<string, string>;
  from_id?: string;
  schema?: string;
};
type InputCurriculumMap = {
  items: readonly string[];
  data?: Record<string, string>;
  from_id?: string;
  schema?: string;
};

type ServerItemList = Expand<
  ItemList & {
    name: string;
    place: string;
    created_at: Date;
  }
>;

type LocalCorriculumMap = {
  items: ReadonlyArray<ServerItemList>;
  data: Record<string, string>;
  from_id: string;
  schema: Schema;
};

type ItemListInDB = Expand<
  Pick<ItemList, "items" | "id"> &
    Partial<Pick<ItemList, "schema_id" | "from_id" | "children">> & {
      created_at: Date;
    }
>;

type ItemListDBView = Readonly<{
  id: string;
  items: readonly string[];
  name: string;
  place: string;
  created_at: Date;
  data: Record<string, string>;
  schema_id?: string;
  from_id?: string;
  children?: readonly string[];
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
  InputCurriculumMap,
  ServerItemList,
  ItemListInDB,
  ServerItemListResponse,
  ItemListDBView,
  LocalItemList,
  LocalCorriculumMap,
  Schema,
  SchemaUnit,
  SharedItemList,
};
