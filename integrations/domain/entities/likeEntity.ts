import type {
  NotificationEntity,
  PostEntity,
  UserEntity,
} from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

export class LikeEntity {
  createdAt!: Date
  id!: Id
  notifications!: NotificationEntity[]
  post!: PostEntity | null
  postId!: Id
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<LikeEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
