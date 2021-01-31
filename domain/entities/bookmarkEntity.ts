import type { PostEntity, UserEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

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
