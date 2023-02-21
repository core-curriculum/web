import type { NextApiRequest, NextApiResponse } from "next";
import { insertNewList, getItemListFromIds } from "@services/itemList/server";
import type {
  InputItemList,
  ServerItemList,
  ServerItemListResponse,
} from "@services/itemList/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerItemList | ServerItemListResponse[]>,
) {
  if (req.method === "POST") {
    const data: InputItemList = req.body;
    const inserted = await insertNewList(data);
    res.status(200).json(inserted);
  } else if (req.method === "GET") {
    try {
      const ids =
        (Array.isArray(req.query?.id) ? (req.query?.id as string[]) : req.query?.id?.split(",")) ||
        [];
      const data = await getItemListFromIds(ids);
      res.status(200).json(data);
    } catch (e) {
      console.error(e);
      res.status(400).json(e);
    }
  }
}
