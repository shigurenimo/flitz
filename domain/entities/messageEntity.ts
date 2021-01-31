import type { ExchangeEntity, UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

export class MessageEntity {
  createdAt!: Date
  exchanges!: ExchangeEntity[]
  id!: Id
  isRead!: boolean
  text!: string
  updatedAt!: Date
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<MessageEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
