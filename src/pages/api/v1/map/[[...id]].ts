import type { NextApiRequest, NextApiResponse } from "next";
import { getCurriculumMapFromId, insertNewCurriculumMap } from "@services/itemList/libs/inServer";
import { InputCurriculumMap, ServerCurriculumMap } from "@services/itemList/libs/types";

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

const insertCurriculumMap = async (
  item: InputCurriculumMap,
): Promise<Response<ServerCurriculumMap>> => {
  try {
    const data = await insertNewCurriculumMap(item);
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
    console.error(message);
    return { ok: false, error: message, errorType: "unknown" };
  }
};

const getMap = async (id: string): Promise<Response<ServerCurriculumMap>> => {
  try {
    const data = await getCurriculumMapFromId(id);
    return { ok: true, data };
  } catch (e) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
    console.error(message);
    return { ok: false, error: message, errorType: "unknown" };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerCurriculumMap | { error: string }>,
) {
  if (req.method === "POST") {
    const response = await insertCurriculumMap(req.body);
    response.ok
      ? res.status(200).json(response.data)
      : res.status(400).json({ error: response.error });
  } else if (req.method === "GET") {
    const ids = (
      (Array.isArray(req.query?.id) ? (req.query?.id as string[]) : req.query?.id?.split(",")) || []
    ).flatMap(id => id.split(","));
    const response = await getMap(ids[0]);
    response.ok
      ? res.status(200).json(response.data)
      : res.status(400).json({ error: response.error });
  }
}
