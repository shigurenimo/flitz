import { IMessageEntity, IUserEntity } from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export interface IExchangeEntity {
  createdAt: Date
  id: Id
  isRead: boolean
  messages: IMessageEntity[]
  relatedUser: IUserEntity | null
  relatedUserId: Id | null
  relatedUsers: IUserEntity[]
  updatedAt: Date
  user: IUserEntity
  userId: Id
}
