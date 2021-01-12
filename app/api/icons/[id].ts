import jdenticon from "jdenticon"
import { NextApiRequest, NextApiResponse } from "next"

const card = async (req: NextApiRequest, resp: NextApiResponse) => {
  const id = req.query.id + ""

  const buffer = jdenticon.toPng(id, 160)

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default card
