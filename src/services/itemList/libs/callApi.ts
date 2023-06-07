import { apiGet, apiPost } from "@services/api";
import {
  InputItemList,
  ServerItemList,
  ServerItemListResponse,
} from "@services/itemList/libs/types";

const shareItemListToServer = async (itemList: InputItemList): Promise<ServerItemList> => {
  try {
    return await apiPost("/api/v1/list", itemList);
  } catch (e) {
    throw new Error(`Fail to share itemList. ${e}`);
  }
};

const getItemListFromServer = async (ids: string[]): Promise<ServerItemListResponse[]> => {
  const params = encodeURI(ids.join(","));
  try {
    return await apiGet(`/api/v1/list/${params}`);
  } catch (e) {
    throw new Error(`Fail to get itemList. error:${e}`);
  }
};

export { shareItemListToServer, getItemListFromServer };
