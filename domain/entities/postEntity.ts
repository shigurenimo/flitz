import type {
  BookmarkEntity,
  FileEntity,
  LikeEntity,
  NotificationEntity,
  ReferenceEntity,
  UserEntity,
} from "domain/entities"
import type { Count, Id, PostText } from "domain/valueObjects"

export class PostEntity {
  bookmarks!: BookmarkEntity[]
  createdAt!: Date
  files!: FileEntity[]
  id!: Id
  likes!: LikeEntity[]
  likesCount!: Count
  notifications!: NotificationEntity[]
  quotation!: PostEntity | null
  quotationId!: Id | null
  quotations!: PostEntity[]
  quotationsCount!: Count
  references!: ReferenceEntity[]
  replies!: PostEntity[]
  repliesCount!: Count
  reply!: PostEntity | null
  replyId!: Id | null
  text!: PostText | null
  updatedAt!: Date
  user!: UserEntity | null
  userId!: Id

  constructor(public props: Omit<PostEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
