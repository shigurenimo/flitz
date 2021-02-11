import type { NotificationEntity, UserEntity } from "integrations/domain/entities/index"
import type { Id } from "integrations/domain/valueObjects"

export class FriendshipEntity {
  createdAt!: Date
  followee!: UserEntity | null
  followeeId!: Id
  follower!: UserEntity | null
  followerId!: Id
  id!: Id
  notifications!: NotificationEntity[]

  constructor(public props: Omit<FriendshipEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
