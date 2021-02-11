import type { MessageEntity, UserEntity } from "integrations/domain/entities/index"
import type { Id } from "integrations/domain/valueObjects"

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
