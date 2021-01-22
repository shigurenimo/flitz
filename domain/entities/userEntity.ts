import {
  IBookmarkEntity,
  IExchangeEntity,
  IFriendshipEntity,
  ILikeEntity,
  IMessageEntity,
  IPostEntity,
  IReferenceEntity,
  ISessionEntity,
  IUserEntity,
} from "domain/entities/interfaces"
import { Biography, Count, Id, Name, Username } from "domain/valueObjects"

export class UserEntity implements IUserEntity {
  account!: Account | null
  biography!: Biography
  bookmarks!: IBookmarkEntity[]
  createdAt!: Date
  exchanges!: IExchangeEntity[]
  files!: File[]
  followees!: IFriendshipEntity[]
  followeesCount!: Count
  followers!: IFriendshipEntity[]
  followersCount!: Count
  id!: Id
  likes!: ILikeEntity[]
  messages!: IMessageEntity[]
  name!: Name | null
  notifications!: Notification[]
  posts!: IPostEntity[]
  references!: IReferenceEntity[]
  relatedExchanges!: IExchangeEntity[]
  relatedGroupExchanges!: IExchangeEntity[]
  sessions!: ISessionEntity[]
  updatedAt!: Date
  username!: Username

  constructor(public props: IUserEntity) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
