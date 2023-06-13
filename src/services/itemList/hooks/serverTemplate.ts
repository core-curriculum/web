import { useSetAtom } from "jotai";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { getCurriculuMapFromServer, getItemListFromServer } from "@services/itemList/libs/callApi";
import { getSchema, getDefaultSchema } from "@services/itemList/libs/schema";
import { curriculumMapAtom } from "./curriculumMap";
import { sharedCurriculumMapAtom, sharedItemListAtom } from "./share";

const useServerTemplate = () => {
  const setItemList = useSetAtom(itemListAtom);
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const apply = async (id: string) => {
    const response = (await getItemListFromServer([id]))?.[0];
    if (!response?.ok) throw new Error(`Cannot find id (${id})`);
    const newItemList = response.data;
    const schema = (await getSchema(newItemList.schema_id)) || getDefaultSchema();
    const from_id = id;
    setItemList({ ...newItemList, schema, from_id });
    setSharedItemList({ ...newItemList, schema, from_id });
  };
  return { apply };
};

const useCurricullumMapServerTemplate = () => {
  const setItemList = useSetAtom(curriculumMapAtom);
  const setSharedItemList = useSetAtom(sharedCurriculumMapAtom);
  const apply = async (id: string) => {
    const response = await getCurriculuMapFromServer(id);
    if (!response?.ok) throw new Error(`Cannot find id (${id})`);
    const newItemList = response.data;
    const schema = (await getSchema(newItemList.schema_id)) || getDefaultSchema();
    const from_id = id;
    setItemList({ ...newItemList, schema, from_id });
    setSharedItemList({ ...newItemList, schema, from_id });
  };
  return { apply };
};

export { useServerTemplate, useCurricullumMapServerTemplate };
