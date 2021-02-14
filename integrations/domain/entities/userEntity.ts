import type {
  AccountEntity,
  BookmarkEntity,
  ExchangeEntity,
  FileEntity,
  FriendshipEntity,
  LikeEntity,
  MessageEntity,
  NotificationEntity,
  PostEntity,
  ReferenceEntity,
  SessionEntity,
} from "integrations/domain/entities"
import type {
  Biography,
  Count,
  Id,
  Name,
  Username,
} from "integrations/domain/valueObjects"

export class UserEntity {
  account!: AccountEntity | null
  biography!: Biography
  bookmarks!: BookmarkEntity[]
  createdAt!: Date
  exchanges!: ExchangeEntity[]
  files!: FileEntity[]
  followees!: FriendshipEntity[]
  followeesCount!: Count
  followers!: FriendshipEntity[]
  followersCount!: Count
  headerImage!: FileEntity | null
  iconImage!: FileEntity | null
  id!: Id
  likes!: LikeEntity[]
  messages!: MessageEntity[]
  name!: Name | null
  notifications!: NotificationEntity[]
  posts!: PostEntity[]
  references!: ReferenceEntity[]
  relatedExchanges!: ExchangeEntity[]
  relatedGroupExchanges!: ExchangeEntity[]
  sessions!: SessionEntity[]
  updatedAt!: Date
  username!: Username

  constructor(public props: Omit<UserEntity, "props">) {
    Object.assign(this, props)
    Object.freeze(this)
  }
}
