import { ReadImageBufferService } from "integrations/application/readImageBuffer.service"
import { Id } from "integrations/domain"
import { createAppContext } from "integrations/registry/createAppContext"
import { NextApiRequest, NextApiResponse } from "next"

const icon = async (req: NextApiRequest, resp: NextApiResponse) => {
  if (Array.isArray(req.query.id)) {
    return resp.status(500).end()
  }

  const app = await createAppContext()

  const buffer = await app
    .get(ReadImageBufferService)
    .call({ fileId: new Id(req.query.id) })

  if (buffer instanceof Error) {
    return resp.status(500).end()
  }

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default icon
