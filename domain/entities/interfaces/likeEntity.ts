import { IPostEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface ILikeEntity {
  createdAt: Date
  id: Id
  notifications: Notification[]
  post: IPostEntity
  postId: Id
  user: IUserEntity
  userId: Id
}
