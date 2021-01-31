import { Id } from "domain/valueObjects"
import {
  EnvRepository,
  FileRepository,
  ImageRepository,
  StorageRepository,
} from "infrastructure/repositories"
import { NextApiRequest, NextApiResponse } from "next"

const icon = async (req: NextApiRequest, resp: NextApiResponse) => {
  if (Array.isArray(req.query.id)) {
    return resp.status(500).end()
  }

  const envRepository = new EnvRepository()

  const fileRepository = new FileRepository()

  const imageRepository = new ImageRepository()

  const storageRepository = new StorageRepository()

  const { fileEntity } = await fileRepository.getFile({
    id: new Id(req.query.id),
  })

  if (fileEntity === null) {
    return resp.status(400).end()
  }

  const filePath = fileEntity.path

  if (envRepository.isLocalProject()) {
    const hasImage = imageRepository.hasImage(filePath)

    if (!hasImage) {
      return resp.status(400).end()
    }
  }

  if (envRepository.isFirebaseProject()) {
    await storageRepository.downloadFileFromCloudStorage(filePath)
  }

  const buffer = await imageRepository.readImage(filePath)

  resp.setHeader("Content-Type", "image/png")

  resp.setHeader("cache-control", "s-maxage=2592000, stale-while-revalidate=0")

  resp.send(buffer)
}

export default icon
