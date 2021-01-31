import type { PostEntity, UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

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
