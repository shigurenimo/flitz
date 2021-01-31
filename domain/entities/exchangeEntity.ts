import type { MessageEntity, UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

export class ExchangeEntity {
  createdAt!: Date
  id!: Id
  isRead!: boolean
  messages!: MessageEntity[]
  relatedUser!: UserEntity | null
  relatedUserId!: Id | null
  relatedUsers!: UserEntity[]
  updatedAt!: Date
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<ExchangeEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
