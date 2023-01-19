
type SchemaUnit = {
  type: "text",
  required: boolean,
  key: string,
  label: string,
}

type Schema = { items: readonly SchemaUnit[], allowEmpty: boolean };

const defaultSchema: Schema = {
  allowEmpty: false,
  items: [
    { type: "text", required: true, key: "name", label: "科目・授業名" },
    { type: "text", required: true, key: "place", label: "施設・大学名" },
  ]
}

const getSchema = (schemaId: string | undefined) => {
  console.log("getSchema")
  return defaultSchema;
}

const isValid = (
  itemList: { items: ReadonlyArray<string>, ex_data?: Record<string, string> },
  schema: Schema
) => {
  const { ex_data: data, items } = itemList;
  if (!schema.allowEmpty && items.length === 0) return false;
  if (schema.items.length === 0) return true;
  if (!data) return false;
  const keys = schema.items.map(u => u.key);
  if (!keys.every(key => key in data)) return false;
  return schema.items.every(({ key, required }) => {
    const value = data[key];
    return value !== "" || !required;
  })
}

const schemaItemsWithValue = (
  itemList: { ex_data?: Record<string, string> },
  schema: Schema
) => {
  return schema.items.map(unit => {
    const value = itemList.ex_data?.[unit.key] ?? "";
    return { ...unit, value };
  })
}
type SchemaItemsWithValue = ReturnType<typeof schemaItemsWithValue>
export type { Schema, SchemaUnit, SchemaItemsWithValue }
export { defaultSchema, getSchema, isValid, schemaItemsWithValue }