import {
  IFriendshipEntity,
  ILikeEntity,
  INotificationEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id, NotificationType } from "domain/valueObjects"

export class NotificationEntity implements INotificationEntity {
  createdAt!: Date
  friendship!: IFriendshipEntity | null
  friendshipId!: Id | null
  id!: Id
  isRead!: boolean
  like!: ILikeEntity | null
  likeId!: Id | null
  post!: IPostEntity | null
  postId!: Id | null
  type!: NotificationType
  uniqueId!: Id
  user!: IUserEntity | null
  userId!: Id | null

  constructor(public props: INotificationEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
