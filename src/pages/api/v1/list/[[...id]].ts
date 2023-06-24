import type { NextApiRequest, NextApiResponse } from "next";
import { insertNewList, getItemListFromIds } from "@services/itemList/server";
import type {
  InputItemList,
  ServerItemList,
  ServerItemListResponse,
} from "@services/itemList/server";

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

const insertItemList = async (item: InputItemList): Promise<Response<ServerItemList>> => {
  try {
    const data = await insertNewList(item);
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
    console.error(message);
    return { ok: false, error: message, errorType: "unknown" };
  }
};

const getItems = async (ids: string[]): Promise<Response<ServerItemListResponse[]>> => {
  try {
    const data = await getItemListFromIds(ids);
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
    console.error(message);
    return { ok: false, error: message, errorType: "unknown" };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerItemList | ServerItemListResponse[] | { error: string }>,
) {
  if (req.method === "POST") {
    const response = await insertItemList(req.body);
    response.ok
      ? res.status(200).json(response.data)
      : res.status(400).json({ error: response.error });
  } else if (req.method === "GET") {
    const ids = (
      (Array.isArray(req.query?.id) ? (req.query?.id as string[]) : req.query?.id?.split(",")) || []
    ).flatMap(id => id.split(","));
    const response = await getItems(ids);
    response.ok
      ? res.status(200).json(response.data)
      : res.status(400).json({ error: response.error });
  }
}
