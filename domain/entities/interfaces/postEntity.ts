import {
  IBookmarkEntity,
  ILikeEntity,
  IReferenceEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Count, PostText } from "domain/valueObjects"

export interface IPostEntity {
  bookmarks: IBookmarkEntity[]
  createdAt: Date
  files: File[]
  id: string
  likes: ILikeEntity[]
  likesCount: Count
  notifications: Notification[]
  quotation: IPostEntity | null
  quotationId: string | null
  quotations: IPostEntity[]
  quotationsCount: Count
  references: IReferenceEntity[]
  replies: IPostEntity[]
  repliesCount: Count
  reply: IPostEntity | null
  replyId: string | null
  text: PostText | null
  updatedAt: Date
  user: IUserEntity
  userId: string
}
