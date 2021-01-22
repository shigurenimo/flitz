import { IExchangeEntity, IMessageEntity } from "domain/entities/interfaces"
import { IUserEntity } from "domain/entities/interfaces/userEntity"
import { Id } from "domain/valueObjects"

export class MessageEntity implements IMessageEntity {
  createdAt!: Date
  exchanges!: IExchangeEntity[]
  id!: Id
  isRead!: boolean
  text!: string
  updatedAt!: Date
  user!: IUserEntity
  userId!: Id

  constructor(public props: IMessageEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
