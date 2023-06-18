import { atom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { validate } from "@services/itemList/libs/schema";
import { curriculumMapAtom } from "./curriculumMap";

const itemListSchemaAtom = focusAtom(itemListAtom, optic => optic.prop("schema"));
const itemListValidationResultAtom = atom(get =>
  validate(get(itemListAtom), get(itemListSchemaAtom)),
);
const isItemListValidAtom = atom(get => get(itemListValidationResultAtom).ok);

const useItemListSchema = () => {
  const schema = useAtomValue(itemListSchemaAtom);
  const isValid = useAtomValue(isItemListValidAtom);
  const validationResult = useAtomValue(itemListValidationResultAtom);
  return { schema, isValid, validationResult };
};

const curriculumMapSchemaAtom = focusAtom(curriculumMapAtom, optic => optic.prop("schema"));
const curriculumMapValidationResultAtom = atom(get => {
  const item = get(curriculumMapAtom);
  const toValidate = { items: item.items.map(item => item.id), data: item.data };
  return validate(toValidate, get(curriculumMapSchemaAtom));
});
const isCurriculumMapValidAtom = atom(get => get(curriculumMapValidationResultAtom).ok);
const useCurriculumMapSchema = () => {
  const schema = useAtomValue(curriculumMapSchemaAtom);
  const isValid = useAtomValue(isCurriculumMapValidAtom);
  const validationResult = useAtomValue(curriculumMapValidationResultAtom);
  return { schema, isValid, validationResult };
};

export { useItemListSchema, useCurriculumMapSchema };
