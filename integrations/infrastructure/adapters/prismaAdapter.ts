import {
  Account,
  Bookmark,
  Exchange,
  File,
  Friendship,
  Like,
  Message,
  Notification,
  Post,
  Reference,
  Session,
  Setting,
  User,
} from "db"
import {
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
  SettingEntity,
  UserEntity,
} from "integrations/domain/entities"
import {
  Biography,
  Count,
  Email,
  FileType,
  HashedPassword,
  Id,
  Name,
  NotificationType,
  Path,
  PostText,
  Service,
  Username,
  UserRole,
} from "integrations/domain/valueObjects"

export class PrismaAdapter {
  toAccountEntity<
    T extends (Account & { user?: User | null }) | null,
    U extends T extends Account ? AccountEntity : null
  >(account?: T): U {
    if (!account) return null as U

    return new AccountEntity({
      createdAt: account.createdAt,
      email: new Email(account.email),
      hashedPassword: account.hashedPassword
        ? new HashedPassword(account.hashedPassword)
        : null,
      id: new Id(account.id),
      role: new UserRole(account.role),
      user: account.user ? this.toUserEntity(account.user) : null,
      userId: new Id(account.userId),
    }) as U
  }

  toBookmarkEntity<
    T extends
      | (Bookmark & {
          post?: Post | null
          user?: User | null
        })
      | null,
    U extends T extends Bookmark ? BookmarkEntity : null
  >(bookmark?: T): U {
    if (!bookmark) return null as U

    return new BookmarkEntity({
      createdAt: bookmark.createdAt,
      post: bookmark.post ? this.toPostEntity(bookmark.post) : null,
      postId: new Id(bookmark.postId),
      user: bookmark.user ? this.toUserEntity(bookmark.user) : null,
      userId: new Id(bookmark.userId),
    }) as U
  }

  toExchangeEntity<
    T extends
      | (Exchange & {
          messages?: Message[]
          relatedUser?: User | null
          relatedUsers?: User[]
          user?: User | null
        })
      | null,
    U extends T extends Exchange ? ExchangeEntity : null
  >(exchange?: T): U {
    if (!exchange) return null as U

    return new ExchangeEntity({
      createdAt: exchange.createdAt,
      id: new Id(exchange.id),
      isRead: exchange.isRead,
      messages: (exchange.messages || []).map((message) => {
        return this.toMessageEntity(message)
      }),
      relatedUser: exchange.relatedUser
        ? this.toUserEntity(exchange.relatedUser)
        : null,
      relatedUserId: exchange.id ? new Id(exchange.id) : null,
      relatedUsers: (exchange.relatedUsers || []).map((user) => {
        return this.toUserEntity(user)
      }),
      updatedAt: exchange.updatedAt,
      user: exchange.user ? this.toUserEntity(exchange.user) : null,
      userId: new Id(exchange.userId),
    }) as U
  }

  toFileEntity<
    T extends
      | (File & {
          headerUser?: User | null
          iconUser?: User | null
          post?: Post | null
          user?: User | null
        })
      | null,
    U extends T extends File ? FileEntity : null
  >(file?: T): U {
    if (!file) return null as U

    return new FileEntity({
      ...file,
      headerUser: file.headerUser ? this.toUserEntity(file.headerUser) : null,
      headerUserId: file.headerUserId ? new Id(file.headerUserId) : null,
      iconUser: file.iconUser ? this.toUserEntity(file.iconUser) : null,
      iconUserId: file.iconUserId ? new Id(file.iconUserId) : null,
      id: new Id(file.id),
      path: new Path(file.path),
      post: file.post ? this.toPostEntity(file.post) : null,
      postId: file.postId ? new Id(file.postId) : null,
      service: file.service ? new Service(file.service) : null,
      type: new FileType(file.type),
      user: file.user ? this.toUserEntity(file.user) : null,
      userId: new Id(file.userId),
    }) as U
  }

  toFriendshipEntity<
    T extends
      | (Friendship & {
          followee?: User
          follower?: User
          notifications?: Notification[]
        })
      | null,
    U extends T extends Friendship ? FriendshipEntity : null
  >(friendship?: T): U {
    if (!friendship) return null as U

    return new FriendshipEntity({
      ...friendship,
      followee: this.toUserEntity(friendship.followee),
      followeeId: new Id(friendship.followeeId),
      follower: this.toUserEntity(friendship.follower),
      followerId: new Id(friendship.followerId),
      id: new Id(friendship.id),
      notifications: (friendship.notifications || []).map((notification) => {
        return this.toNotificationEntity(notification)
      }),
    }) as U
  }

  toLikeEntity<
    T extends
      | (Like & {
          notifications?: Notification[]
          post?: Post | null
          user?: User | null
        })
      | null,
    U extends T extends Like ? LikeEntity : null
  >(like?: T): U {
    if (!like) return null as U

    return new LikeEntity({
      createdAt: like.createdAt,
      id: new Id(like.id),
      notifications: (like.notifications || []).map((notification) => {
        return this.toNotificationEntity(notification)
      }),
      post: like.post ? this.toPostEntity(like.post) : null,
      postId: new Id(like.postId),
      user: like.user ? this.toUserEntity(like.user) : null,
      userId: new Id(like.userId),
    }) as U
  }

  toMessageEntity<
    T extends
      | (Message & {
          user?: User | null
          exchanges?: Exchange[]
        })
      | null,
    U extends T extends Message ? MessageEntity : null
  >(message?: T): U {
    if (!message) return null as U

    return new MessageEntity({
      createdAt: message.createdAt,
      exchanges: (message.exchanges || []).map((exchange) => {
        return this.toExchangeEntity(exchange)
      }),
      id: new Id(message.id),
      isRead: message.isRead,
      text: message.text,
      updatedAt: message.updatedAt,
      user: message.user ? this.toUserEntity(message.user) : null,
      userId: new Id(message.userId),
    }) as U
  }

  toNotificationEntity<
    T extends
      | (Notification & {
          friendship?: Friendship | null
          post?: Post | null
          like?: Like | null
          user?: User | null
        })
      | null,
    U extends T extends Notification ? NotificationEntity : null
  >(notification?: T): U {
    if (!notification) return null as U

    return new NotificationEntity({
      createdAt: notification.createdAt,
      friendship: notification.friendship
        ? this.toFriendshipEntity(notification.friendship)
        : null,
      friendshipId: notification.friendshipId
        ? new Id(notification.friendshipId)
        : null,
      id: new Id(notification.id),
      isRead: notification.isRead,
      like: notification.like ? this.toLikeEntity(notification.like) : null,
      likeId: notification.likeId ? new Id(notification.likeId) : null,
      post: notification.post ? this.toPostEntity(notification.post) : null,
      postId: notification.postId ? new Id(notification.postId) : null,
      type: new NotificationType(notification.type),
      uniqueId: new Id(notification.uniqueId),
      user: notification.user ? this.toUserEntity(notification.user) : null,
      userId: notification.userId ? new Id(notification.userId) : null,
    }) as U
  }

  toPostEntity<
    T extends
      | (Post & {
          bookmarks?: Bookmark[]
          files?: File[]
          likes?: Like[]
          notifications?: Notification[]
          quotation?: Post | null
          quotations?: Post[]
          references?: Reference[]
          replies?: Post[]
          reply?: Post | null
          user?: User | null
        })
      | null,
    U extends T extends Post ? PostEntity : null
  >(post?: T): U {
    if (!post) return null as U

    return new PostEntity({
      bookmarks: (post.bookmarks || []).map((bookmark) => {
        return this.toBookmarkEntity(bookmark)
      }),
      createdAt: post.createdAt,
      files: (post.files || []).map((file) => {
        return this.toFileEntity(file)
      }),
      id: new Id(post.id),
      likes: (post.likes || []).map((like) => {
        return this.toLikeEntity(like)
      }),
      likesCount: new Count(post.likesCount),
      notifications: (post.notifications || []).map((notification) => {
        return this.toNotificationEntity(notification)
      }),
      quotation: post.quotation ? this.toPostEntity(post.quotation) : null,
      quotationId: post.quotationId ? new Id(post.quotationId) : null,
      quotations: (post.quotations || []).map((quotation) => {
        return this.toPostEntity(quotation)
      }),
      quotationsCount: new Count(post.quotationsCount),
      references: (post.references || []).map((reference) => {
        return this.toReferenceEntity(reference)
      }),
      replies: (post.replies || []).map((reply) => {
        return this.toPostEntity(reply)
      }),
      repliesCount: new Count(post.repliesCount),
      reply: post.reply ? this.toPostEntity(post.reply) : null,
      replyId: post.replyId ? new Id(post.replyId) : null,
      text: post.text ? new PostText(post.text) : null,
      updatedAt: new Date(post.updatedAt),
      user: post.user ? this.toUserEntity(post.user) : null,
      userId: new Id(post.userId),
    }) as U
  }

  toReferenceEntity<
    T extends
      | (Reference & {
          post?: Post | null
          user?: User | null
        })
      | null,
    U extends T extends Reference ? ReferenceEntity : null
  >(reference?: T): U {
    if (!reference) return null as U

    return new ReferenceEntity({
      createdAt: reference.createdAt,
      isRead: reference.isRead,
      post: reference.post ? this.toPostEntity(reference.post) : null,
      postId: new Id(reference.postId),
      user: reference.user ? this.toUserEntity(reference.user) : null,
      userId: new Id(reference.userId),
    }) as U
  }

  toSessionEntity<
    T extends (Session & { user?: User | null }) | null,
    U extends T extends Session ? SessionEntity : null
  >(session?: T): U {
    if (!session) return null as U

    return new SessionEntity({
      antiCSRFToken: session.antiCSRFToken || null,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt || null,
      handle: session.handle,
      hashedSessionToken: session.hashedSessionToken || null,
      id: new Id(session.id),
      privateData: session.privateData || null,
      publicData: session.publicData || null,
      updatedAt: session.updatedAt,
      user: session.user ? this.toUserEntity(session.user) : null,
      userId: session.userId ? new Id(session.userId) : null,
    }) as U
  }

  toSettingEntity<
    T extends (Setting & { user?: User | null }) | null,
    U extends T extends Setting ? SettingEntity : null
  >(setting?: T): U {
    if (!setting) return null as U

    return new SettingEntity({
      discoverableByEmail: setting.discoverableByEmail,
      fcmToken: setting.fcmToken || null,
      fcmTokenForMobile: setting.fcmTokenForMobile || null,
      id: new Id(setting.id),
      notificationEmail: setting.notificationEmail
        ? new Email(setting.notificationEmail)
        : null,
      protected: setting.protected,
      subscribeMessage: setting.subscribeMessage,
      subscribePostLike: setting.subscribePostLike,
      subscribePostQuotation: setting.subscribePostQuotation,
      user: setting.user ? this.toUserEntity(setting.user) : null,
      userId: setting.userId ? new Id(setting.userId) : null,
    }) as U
  }

  toUserEntity<
    T extends
      | (User & {
          account?: Account | null
          bookmarks?: Bookmark[]
          exchanges?: Exchange[]
          files?: File[] | null
          followees?: Friendship[]
          followers?: Friendship[]
          headerImage?: File | null
          iconImage?: File | null
          likes?: Like[]
          messages?: Message[]
          notifications?: Notification[]
          posts?: Post[]
          references?: Reference[]
          relatedExchanges?: Exchange[]
          relatedGroupExchanges?: Exchange[]
          sessions?: Session[]
        })
      | null,
    U extends T extends User ? UserEntity : null
  >(user?: T): U {
    if (!user) return null as U

    return new UserEntity({
      account: user.account ? this.toAccountEntity(user.account) : null,
      biography: new Biography(user.biography),
      bookmarks: (user.bookmarks || []).map((bookmark) => {
        return this.toBookmarkEntity(bookmark)
      }),
      createdAt: user.createdAt,
      exchanges: (user.exchanges || []).map((exchange) => {
        return this.toExchangeEntity(exchange)
      }),
      files: (user.files || []).map((exchange) => {
        return this.toFileEntity(exchange)
      }),
      followees: (user.followees || []).map((followee) => {
        return this.toFriendshipEntity(followee)
      }),
      followeesCount: new Count(user.followeesCount),
      followers: (user.followers || []).map((follower) => {
        return this.toFriendshipEntity(follower)
      }),
      followersCount: new Count(user.followersCount),
      headerImage: this.toFileEntity(user.headerImage),
      iconImage: user.iconImage ? this.toFileEntity(user.iconImage) : null,
      id: new Id(user.id),
      likes: (user.likes || []).map((like) => {
        return this.toLikeEntity(like)
      }),
      messages: (user.messages || []).map((message) => {
        return this.toMessageEntity(message)
      }),
      name: user.name ? new Name(user.name) : null,
      notifications: (user.notifications || []).map((notification) => {
        return this.toNotificationEntity(notification)
      }),
      posts: (user.posts || []).map((post) => {
        return this.toPostEntity(post)
      }),
      references: (user.references || []).map((reference) => {
        return this.toReferenceEntity(reference)
      }),
      relatedExchanges: (user.relatedExchanges || []).map((exchange) => {
        return this.toExchangeEntity(exchange)
      }),
      relatedGroupExchanges: (user.relatedGroupExchanges || []).map(
        (exchange) => {
          return this.toExchangeEntity(exchange)
        }
      ),
      sessions: (user.sessions || []).map((session) => {
        return this.toSessionEntity(session)
      }),
      updatedAt: user.updatedAt,
      username: new Username(user.username),
    }) as U
  }
}
