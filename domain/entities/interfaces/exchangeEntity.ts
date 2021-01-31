import type { MessageEntity, UserEntity } from "domain/entities"
import { Id } from "domain/valueObjects"

export interface IExchangeEntity {
  createdAt: Date
  id: Id
  isRead: boolean
  messages: MessageEntity[]
  relatedUser: UserEntity | null
  relatedUserId: Id | null
  relatedUsers: UserEntity[]
  updatedAt: Date
  user: UserEntity
  userId: Id
}
