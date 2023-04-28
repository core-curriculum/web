import { useSetAtom } from "jotai";
import { itemListAtom } from "@services/itemList/hooks/itemList";
import { getItemListFromServer } from "@services/itemList/libs/callApi";
import { getSchema, getDefaultSchema } from "@services/itemList/libs/schema";
import { sharedItemListAtom } from "./share";

const useServerTemplate = () => {
  const setItemList = useSetAtom(itemListAtom);
  const setSharedItemList = useSetAtom(sharedItemListAtom);
  const apply = async (id: string) => {
    const newItemList = await getItemListFromServer(id);
    if (!newItemList) throw new Error(`Cannot find id (${id})`);
    const schema = (await getSchema(newItemList.id)) || getDefaultSchema();
    const from_id = id;
    setItemList({ ...newItemList, schema, from_id });
    setSharedItemList({ ...newItemList, schema, from_id });
  };
  return { apply };
};

export { useServerTemplate };
