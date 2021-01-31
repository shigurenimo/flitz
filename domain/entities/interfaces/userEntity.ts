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
} from "domain/entities"
import type {
  Biography,
  Count,
  Id,
  Name,
  Url,
  Username,
} from "domain/valueObjects"

export interface IUserEntity {
  account: AccountEntity | null
  biography: Biography
  bookmarks: BookmarkEntity[]
  createdAt: Date
  exchanges: ExchangeEntity[]
  files: FileEntity[]
  followees: FriendshipEntity[]
  followeesCount: Count
  followers: FriendshipEntity[]
  followersCount: Count
  headerImage: FileEntity | null
  iconImage: FileEntity | null
  id: Id
  likes: LikeEntity[]
  messages: MessageEntity[]
  name: Name | null
  notifications: NotificationEntity[]
  posts: PostEntity[]
  references: ReferenceEntity[]
  relatedExchanges: ExchangeEntity[]
  relatedGroupExchanges: ExchangeEntity[]
  siteURL: Url
  sessions: SessionEntity[]
  updatedAt: Date
  username: Username
}
