import {
  ILikeEntity,
  IPostEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Id } from "domain/valueObjects"

export class LikeEntity implements ILikeEntity {
  createdAt!: Date
  id!: Id
  notifications!: Notification[]
  post!: IPostEntity
  postId!: Id
  user!: IUserEntity
  userId!: Id

  constructor(public props: ILikeEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
