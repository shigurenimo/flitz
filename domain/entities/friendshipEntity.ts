import type { NotificationEntity, UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

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
