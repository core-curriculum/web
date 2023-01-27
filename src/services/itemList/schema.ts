import { Schema, SchemaUnit } from "@services/itemList/types";

const defaultSchema = {
  id: "",
  allowEmpty: false,
  items: [
    { type: "text", required: true, key: "name", label: "科目・授業名" },
    { type: "text", required: true, key: "place", label: "施設・大学名" },
  ]
} satisfies Schema

type ValidateResult = Readonly<{
  ok: true
}> | Readonly<{
  ok: false,
  errors: readonly { key?: string, type: string, message: string }[];
}>
const makeOk = () => ({ ok: true } as const satisfies ValidateResult);

const getDefaultSchema = () => defaultSchema;

const validate = (
  itemList: { items: ReadonlyArray<string>, ex_data?: Record<string, string> },
  schema: Schema
) => {
  const { ex_data: data = {}, items } = itemList;
  if (!schema.allowEmpty && items.length === 0) {
    return ({
      ok: false, errors: [{ type: "empty", message: "empty is not allowed" }
      ]
    } as const satisfies ValidateResult)
  };
  if (schema.items.length === 0) return makeOk();
  const errors = schema.items.flatMap(({ key, required }) => {
    const value = key in data ? data[key] : "";
    return value !== "" || !required
      ? []
      : [{ key, type: "required", message: `${key} is required` }];
  })
  return errors.length === 0
    ? makeOk()
    : { ok: false, errors } as const satisfies ValidateResult
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
export { defaultSchema, validate, schemaItemsWithValue, getDefaultSchema }