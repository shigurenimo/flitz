import type { PostEntity, UserEntity } from "domain/entities"
import { Id } from "domain/valueObjects"

export interface IBookmarkEntity {
  createdAt: Date
  post: PostEntity
  postId: Id
  user: UserEntity
  userId: Id
}
