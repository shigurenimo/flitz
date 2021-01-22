import {
  IFriendshipEntity,
  ILikeEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id, NotificationType } from "domain/valueObjects"

export interface INotificationEntity {
  createdAt: Date
  friendship: IFriendshipEntity | null
  friendshipId: Id | null
  id: Id
  isRead: boolean
  like: ILikeEntity | null
  likeId: Id | null
  post: IPostEntity | null
  postId: Id | null
  type: NotificationType
  uniqueId: Id
  user: IUserEntity | null
  userId: Id | null
}
