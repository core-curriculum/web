import type { NextApiRequest, NextApiResponse } from "next";
import { insertNewList, getItemListFromId } from "@services/itemList/server";
import type { InputItemList, ServerItemList } from "@services/itemList/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ServerItemList>) {
  if (req.method === "POST") {
    const data: InputItemList = req.body;
    const inserted = await insertNewList(data);
    res.status(200).json(inserted);
  } else if (req.method === "GET") {
    const id = req.query.id as string;
    try {
      const data = await getItemListFromId(id);
      res.status(200).json(data);
    } catch {
      res.status(400);
    }
  }
}
