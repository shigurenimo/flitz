import { BlitzApiHandler } from "blitz"
import { ReadImageBufferService } from "integrations/application/post/readImageBuffer.service"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const icon: BlitzApiHandler = async (req, resp) => {
  if (Array.isArray(req.query.id)) {
    return resp.status(500).end()
  }

  const readImageBufferService = container.resolve(ReadImageBufferService)

  const buffer = await readImageBufferService.execute({
    fileId: new Id(req.query.id),
  })

  if (buffer instanceof Error) {
    return resp.status(500).end()
  }

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default icon
