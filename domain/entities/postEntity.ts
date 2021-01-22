import {
  IBookmarkEntity,
  ILikeEntity,
  IPostEntity,
  IReferenceEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Count, PostText } from "domain/valueObjects"

export type PostEntityProps = IPostEntity & {
  bookmarks?: IPostEntity["quotation"]
  files?: IPostEntity["files"]
  likes?: IPostEntity["likes"]
  notifications?: IPostEntity["notifications"]
  quotation?: IPostEntity["quotation"]
  quotationId?: IPostEntity["quotationId"]
  quotations?: IPostEntity["quotations"]
  references?: IPostEntity["references"]
  replies?: IPostEntity["replies"]
  reply?: IPostEntity["reply"]
  replyId?: IPostEntity["replyId"]
  text?: IPostEntity["text"]
}

export class PostEntity implements IPostEntity {
  bookmarks!: IBookmarkEntity[]
  createdAt!: Date
  files!: File[]
  id!: string
  likes!: ILikeEntity[]
  likesCount!: Count
  notifications!: Notification[]
  quotation!: IPostEntity | null
  quotationId!: string | null
  quotations!: IPostEntity[]
  quotationsCount!: Count
  references!: IReferenceEntity[]
  replies!: IPostEntity[]
  repliesCount!: Count
  reply!: IPostEntity | null
  replyId!: string | null
  text!: PostText | null
  updatedAt!: Date
  user!: IUserEntity
  userId!: string

  constructor(public props: PostEntityProps) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
