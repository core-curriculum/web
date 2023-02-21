import { Schema as SchemaItems, SchemaUnit,validate as validateSchema } from "@libs/schema";

type Schema = {id:string,items:SchemaItems};
const defaultSchema = {
  id: "",
  items: [
    { key: "$items", type: "list", rules:["required"] },
    { key: "name", type: "text", rules:["required"], label: "科目・授業名" },
    { key: "place", type: "text", rules:["required"], label: "施設・大学名" },
  ]
} satisfies Schema

const getDefaultSchema = () => defaultSchema;

const validate = (
  itemList: { items: ReadonlyArray<string>, data?: Record<string, string> },
  schema: Schema
) => {
  const { data = {}, items } = itemList;
  const values = {$items:items,...data}
  return validateSchema(values,schema.items);
}

const schemaItemsWithValue = (
  itemList: { data?: Record<string, string> },
  schema: Schema
) => {
  return schema.items.filter(item=>item.key!=="$items").map(unit => {
    const value = itemList.data?.[unit.key] ?? "";
    return { ...unit, value };
  })
}

const getSchema = async (schemaId: string | undefined): Promise<Schema> => {
  return getDefaultSchema();
};

type SchemaItemsWithValue = ReturnType<typeof schemaItemsWithValue>
export type { Schema, SchemaUnit, SchemaItemsWithValue }
export { defaultSchema, validate, schemaItemsWithValue, getDefaultSchema,getSchema }