import { INotificationEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IFriendshipEntity {
  createdAt: Date
  followee: IUserEntity
  followeeId: Id
  follower: IUserEntity
  followerId: Id
  id: Id
  notification: INotificationEntity[]
}
