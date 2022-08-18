import { toPng } from "jdenticon"

import { NextApiHandler } from "next"
import { api } from "app/blitz-server"

const icon: NextApiHandler = async (req, resp) => {
  const id = req.query.id + ""

  const buffer = toPng(id, 160)

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default api(icon)
