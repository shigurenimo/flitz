import {
  IExchangeEntity,
  IMessageEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class ExchangeEntity implements IExchangeEntity {
  createdAt!: Date
  id!: Id
  isRead!: boolean
  messages!: IMessageEntity[]
  relatedUser!: IUserEntity | null
  relatedUserId!: Id | null
  relatedUsers!: IUserEntity[]
  updatedAt!: Date
  user!: IUserEntity
  userId!: Id

  constructor(public props: IExchangeEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
