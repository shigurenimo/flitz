import type { PostEntity, UserEntity } from "integrations/domain/entities/index"
import type { FileType, Id, Path, Service } from "integrations/domain/valueObjects"

export class FileEntity {
  createdAt!: Date
  headerUser!: UserEntity | null
  headerUserId!: Id | null
  iconUser!: UserEntity | null
  iconUserId!: Id | null
  id!: Id
  path!: Path
  post!: PostEntity | null
  postId!: Id | null
  service!: Service | null
  type!: FileType
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<FileEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
