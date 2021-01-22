import {
  IBookmarkEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class BookmarkEntity implements IBookmarkEntity {
  createdAt!: Date
  post!: IPostEntity
  postId!: Id
  user!: IUserEntity
  userId!: Id

  constructor(public props: IBookmarkEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
