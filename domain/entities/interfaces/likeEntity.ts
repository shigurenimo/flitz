import {
  INotificationEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface ILikeEntity {
  createdAt: Date
  id: Id
  notifications: INotificationEntity[]
  post: IPostEntity | null
  postId: Id
  user: IUserEntity | null
  userId: Id
}
