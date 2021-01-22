import { IPostEntity, IUserEntity } from "domain/entities/interfaces"
import { FileType, Id, Path, Service } from "domain/valueObjects"

export interface IFileEntity {
  createdAt: Date
  id: Id
  path: Path
  post: IPostEntity | null
  postId: Id | null
  service: Service | null
  type: FileType
  user: IUserEntity | null
  userId: Id
}
