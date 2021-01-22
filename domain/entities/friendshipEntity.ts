import {
  IFriendshipEntity,
  INotificationEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class FriendshipEntity implements IFriendshipEntity {
  createdAt!: Date
  followee!: IUserEntity
  followeeId!: Id
  follower!: IUserEntity
  followerId!: Id
  id!: Id
  notification!: INotificationEntity[]

  constructor(public props: IFriendshipEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
