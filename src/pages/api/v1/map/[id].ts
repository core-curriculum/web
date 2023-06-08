import type { NextApiRequest, NextApiResponse } from "next";
import { insertNewCurriculumMap } from "@services/itemList/libs/inServer";
import { InputCurriculumMap } from "@services/itemList/libs/types";
import type { ServerItemList } from "@services/itemList/server";

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

const insertCurriculumMap = async (item: InputCurriculumMap): Promise<Response<ServerItemList>> => {
  try {
    const data = await insertNewCurriculumMap(item);
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
    console.error(message);
    return { ok: false, error: message, errorType: "unknown" };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerItemList | { error: string }>,
) {
  if (req.method === "POST") {
    const response = await insertCurriculumMap(req.body);
    response.ok
      ? res.status(200).json(response.data)
      : res.status(400).json({ error: response.error });
  }
}
