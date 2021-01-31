import {
  BookmarkEntity,
  FileEntity,
  LikeEntity,
  ReferenceEntity,
  UserEntity,
} from "domain/entities"
import { Count, Id, PostText } from "domain/valueObjects"

export interface IPostEntity {
  bookmarks: BookmarkEntity[]
  createdAt: Date
  files: FileEntity[]
  id: Id
  likes: LikeEntity[]
  likesCount: Count
  notifications: Notification[]
  quotation: IPostEntity | null
  quotationId: Id | null
  quotations: IPostEntity[]
  quotationsCount: Count
  references: ReferenceEntity[]
  replies: IPostEntity[]
  repliesCount: Count
  reply: IPostEntity | null
  replyId: Id | null
  text: PostText | null
  updatedAt: Date
  user: UserEntity | null
  userId: Id
}
