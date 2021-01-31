import { INotificationEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IFriendshipEntity {
  createdAt: Date
  followee: IUserEntity | null
  followeeId: Id
  follower: IUserEntity | null
  followerId: Id
  id: Id
  notifications: INotificationEntity[]
}
