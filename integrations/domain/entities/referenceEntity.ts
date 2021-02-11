import type { PostEntity, UserEntity } from "integrations/domain/entities/index"
import type { Id } from "integrations/domain/valueObjects"

export class ReferenceEntity {
  createdAt!: Date
  isRead!: boolean
  post!: PostEntity | null
  postId!: Id
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<ReferenceEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
