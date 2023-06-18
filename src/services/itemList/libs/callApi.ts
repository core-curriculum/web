import { apiGet, apiPost } from "@services/api";
import {
  InputCurriculumMap,
  InputItemList,
  ServerItemList,
  ServerItemListResponse,
  ServerCurriculumMap,
} from "@services/itemList/libs/types";

type Response<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
      errorType: string;
    };

const shareItemListToServer = async (itemList: InputItemList): Promise<ServerItemList> => {
  try {
    return await apiPost("/api/v1/list", itemList);
  } catch (e) {
    throw new Error(`Fail to share itemList. ${e}`);
  }
};

const shareCurriculumMapToServer = async (
  curriculumMap: InputCurriculumMap,
): Promise<ServerCurriculumMap> => {
  try {
    return await apiPost("/api/v1/map", curriculumMap);
  } catch (e) {
    throw new Error(`Fail to share curriculumMap. ${e}`);
  }
};

const getCurriculuMapFromServer = async (id: string): Promise<Response<ServerCurriculumMap>> => {
  try {
    return await apiGet(`/api/v1/map/${id}`);
  } catch (e) {
    throw new Error(`Fail to get curriculumMap. ${e}`);
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

export {
  shareItemListToServer,
  getItemListFromServer,
  shareCurriculumMapToServer,
  getCurriculuMapFromServer,
};
