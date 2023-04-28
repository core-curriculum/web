import { apiGet, apiPost } from "@services/api";
import { InputItemList, ServerItemList } from "@services/itemList/libs/types";

const shareItemListToServer = async (itemList: InputItemList): Promise<ServerItemList> => {
  try {
    return await apiPost("/api/v1/itemList", itemList);
  } catch (e) {
    throw new Error(`Fail to share itemList. ${e}`);
  }
};

const getItemListFromServer = async (id: string): Promise<ServerItemList> => {
  const params = new URLSearchParams({ id });
  try {
    return await apiGet(`/api/v1/itemList?${params}`);
  } catch (e) {
    throw new Error(`Fail to get itemList. error:${e}`);
  }
};

export { shareItemListToServer, getItemListFromServer };
