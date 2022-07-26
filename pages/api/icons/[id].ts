import { BlitzApiHandler } from "blitz"
import jdenticon from "jdenticon"

const icon: BlitzApiHandler = async (req, resp) => {
  const id = req.query.id + ""

  const buffer = jdenticon.toPng(id, 160)

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default icon
