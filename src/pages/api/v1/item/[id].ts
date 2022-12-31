import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  data: string[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const uid = (req.query?.id as string)?.split(",")
  res.status(200).json([{ data: uid }])
}
