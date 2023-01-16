import type { NextApiRequest, NextApiResponse } from 'next'
import { InputItemList, insertNewList, getItemListFromId } from '@services/serverItemList'


type Data = {
  ex_data: Record<string, string>;
  id: string;
  items: readonly string[];
  schema_id: string;
  created_at: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const data: InputItemList = req.body;
    const inserted = await insertNewList(data);
    res.status(200).json(inserted)
  } else if (req.method === "GET") {
    const id = req.query.id as string;
    try {
      const data = await getItemListFromId(id);
      res.status(200).json(data)
    } catch {
      res.status(400)
    }
  }
}
