import { IPostEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IBookmarkEntity {
  createdAt: Date
  post: IPostEntity
  postId: Id
  user: IUserEntity
  userId: Id
}
