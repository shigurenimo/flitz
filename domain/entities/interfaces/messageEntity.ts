import { IExchangeEntity } from "domain/entities/interfaces"
import { IUserEntity } from "domain/entities/interfaces/userEntity"
import { Id } from "domain/valueObjects"

export interface IMessageEntity {
  createdAt: Date
  exchanges: IExchangeEntity[]
  id: Id
  isRead: boolean
  text: string
  updatedAt: Date
  user: IUserEntity
  userId: Id
}
