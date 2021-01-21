import { Id } from "domain/valueObjects"
import {
  EnvRepository,
  FileRepository,
  StorageRepository,
} from "infrastructure"
import { ImageRepository } from "infrastructure/imageRepository"
import { NextApiRequest, NextApiResponse } from "next"

const icon = async (req: NextApiRequest, resp: NextApiResponse) => {
  if (Array.isArray(req.query.id)) {
    return resp.status(500).end()
  }

  const file = await FileRepository.getFile({ id: new Id(req.query.id) })

  if (file === null) {
    return resp.status(400).end()
  }

  const filePath = new Id(file.path)

  if (EnvRepository.isLocalProject()) {
    const hasImage = ImageRepository.hasImage(filePath)

    if (!hasImage) {
      return resp.status(400).end()
    }
  }

  if (EnvRepository.isFirebaseProject()) {
    await StorageRepository.downloadFileFromCloudStorage(filePath)
  }

  const buffer = await ImageRepository.readImage(filePath)

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default icon
