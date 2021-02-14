import type { PostEntity, UserEntity } from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

export class BookmarkEntity {
  createdAt!: Date
  post!: PostEntity | null
  postId!: Id
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<BookmarkEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
