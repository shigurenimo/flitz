import type { PostEntity, UserEntity } from "domain/entities"
import { FileType, Id, Path, Service } from "domain/valueObjects"

export interface IFileEntity {
  createdAt: Date
  headerUser: UserEntity | null
  headerUserId: Id | null
  iconUser: UserEntity | null
  iconUserId: Id | null
  id: Id
  path: Path
  post: PostEntity | null
  postId: Id | null
  service: Service | null
  type: FileType
  user: UserEntity | null
  userId: Id
}
