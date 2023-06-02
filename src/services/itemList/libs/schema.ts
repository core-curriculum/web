import { 
  Schema as SchemaItems, 
  SchemaUnit,schemaWithValue,
  validate as validateSchema } from "@libs/schema";

type Schema = {id:string,items:SchemaItems};
const defaultSchema = {
  id: "",
  items: [
    { key: "$items", type: "list", rules:["required"] },
    { key: "name", type: "text", rules:["required"], label: "$name" },
    { key: "place", type: "text", rules:["required"], label: "$place" },
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
  data: Record<string, string>,
  schema: Schema,
  onTranslateLabel?: (label: string) => string
) => {
  return schemaWithValue(data,schema.items).filter(item=>item.key!=="$items").map(unit => {
    const value = unit.value!==undefined ? `${unit.value}` ?? "" : "";
    if (onTranslateLabel && unit["label"]) {
      return { ...unit, value,label: onTranslateLabel(unit["label"]) };
    }
    return { ...unit, value };
  })
}

const getSchema = async (schemaId: string | undefined): Promise<Schema> => {
  return getDefaultSchema();
};

type SchemaItemsWithValue = ReturnType<typeof schemaItemsWithValue>
export type { Schema, SchemaUnit, SchemaItemsWithValue }
export { defaultSchema, validate, schemaItemsWithValue, getDefaultSchema,getSchema }