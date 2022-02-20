import { captureException } from "@sentry/node"
import {
  FileEntity,
  FileTypeFactory,
  Id,
  IdFactory,
  Image,
  Service,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import {
  EnvAdapter,
  FileRepository,
  ImageAdapter,
  StorageAdapter,
} from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  image: Image | null
}

@injectable()
export class CreateFileService {
  constructor(
    private envRepository: EnvAdapter,
    private fileRepository: FileRepository,
    private imageRepository: ImageAdapter,
    private storageRepository: StorageAdapter
  ) {}

  async execute(props: Props) {
    try {
      if (props.image === null) {
        return null
      }

      const filePath = this.storageRepository.createPath()

      await this.imageRepository.writeImage(props.image, filePath)

      await this.storageRepository.uploadToCloudStorage(filePath)

      const file = new FileEntity({
        id: IdFactory.nanoid(),
        userId: props.userId,
        type: FileTypeFactory.png(),
        service: new Service("CLOUD_STORAGE"),
        path: filePath,
      })

      await this.fileRepository.upsert(file)

      return file
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
