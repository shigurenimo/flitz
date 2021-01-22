import {
  IFileEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { FileType, Id, Path, Service } from "domain/valueObjects"

export class FileEntity implements IFileEntity {
  createdAt!: Date
  id!: Id
  path!: Path
  post!: IPostEntity | null
  postId!: Id | null
  service!: Service | null
  type!: FileType
  user!: IUserEntity | null
  userId!: Id

  constructor(public props: IFileEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
