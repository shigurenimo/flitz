import type {
  FriendshipEntity,
  LikeEntity,
  PostEntity,
  UserEntity,
} from "integrations/domain/entities"
import type { Id, NotificationType } from "integrations/domain/valueObjects"

export class NotificationEntity {
  createdAt!: Date
  friendship!: FriendshipEntity | null
  friendshipId!: Id | null
  id!: Id
  isRead!: boolean
  like!: LikeEntity | null
  likeId!: Id | null
  post!: PostEntity | null
  postId!: Id | null
  type!: NotificationType
  uniqueId!: Id
  user!: UserEntity | null
  userId!: Id | null

  constructor(public props: Omit<NotificationEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
