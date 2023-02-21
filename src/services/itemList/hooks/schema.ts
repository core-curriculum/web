import { atom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { itemListAtom, useListData } from "@services/itemList/hooks/itemList";
import { schemaItemsWithValue, validate } from "@services/itemList/libs/schema";

const schemaAtom = focusAtom(itemListAtom, optic => optic.prop("schema"));
const schemaWithValueAtom = atom(get => schemaItemsWithValue(get(itemListAtom), get(schemaAtom)));
const validationResultAtom = atom(get => validate(get(itemListAtom), get(schemaAtom)));
const isValidAtom = atom(get => get(validationResultAtom).ok);

const useSchema = () => {
  const schema = useAtomValue(schemaAtom);
  const isValid = useAtomValue(isValidAtom);
  const validationResult = useAtomValue(validationResultAtom);
  return { schema, isValid, validationResult };
};

const useSchemaWithValue = () => {
  const schemaWithValue = useAtomValue(schemaWithValueAtom);
  const { set: setListData } = useListData();
  const set = (key: string, value: string) => setListData(key, value);
  return { schemaWithValue, set };
};

export { useSchema, useSchemaWithValue };
