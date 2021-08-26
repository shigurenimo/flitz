import { File, Like, Post, Setting } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"
import { PrismaFeed } from "integrations/infrastructure/types/prismaFeed"
import { PrismaFeedPost } from "integrations/infrastructure/types/prismaFeedPost"
import { PrismaFollowee } from "integrations/infrastructure/types/prismaFollowee"
import { PrismaFollower } from "integrations/infrastructure/types/prismaFollower"
import { PrismaProfile } from "integrations/infrastructure/types/prismaProfile"
import { PrismaUserExchange } from "integrations/infrastructure/types/prismaUserExchange"
import { PrismaUserMessage } from "integrations/infrastructure/types/prismaUserMessage"
import { PrismaUserNotification } from "integrations/infrastructure/types/prismaUserNotification"
import { AppEmbeddedUser } from "integrations/interface/types/appEmbeddedUser"
import { AppUserExchange } from "integrations/interface/types/appExchangeMessage"
import { AppFeed } from "integrations/interface/types/appFeed"
import { AppFeedPost } from "integrations/interface/types/appFeedPost"
import { AppFollower } from "integrations/interface/types/appFollower"
import { AppLikePost } from "integrations/interface/types/appLikePost"
import { AppNotification } from "integrations/interface/types/appNotification"
import { AppPost } from "integrations/interface/types/appPost"
import { AppProfile } from "integrations/interface/types/appProfile"
import { AppQuotation } from "integrations/interface/types/appQuotation"
import { AppSetting } from "integrations/interface/types/appSetting"
import { AppUserMessage } from "integrations/interface/types/appUserMessage"

export class ViewConverter {
  toPost(
    post: Post & {
      files: File[]
      likes: Like[]
      quotations: Post[]
      replies: Post[]
    }
  ): AppPost {
    return {
      id: post.id,
      createdAt: post.createdAt,
      fileIds: post.files.map((file) => file.id),
      likesCount: post.likesCount,
      quotationsCount: post.quotationsCount,
      repliesCount: post.repliesCount,
      hasLike: (post.likes || []).length > 0,
      hasQuotation: (post.quotations || []).length > 0,
      hasReply: (post.replies || []).length > 0,
      text: post.text || null,
    }
  }

  toLike(like: { post: Post }): AppLikePost {
    return {
      id: like.post.id,
      createdAt: like.post.createdAt,
      text: like.post.text || null,
    }
  }

  toEmbededUser(user: PrismaEmbeddedUser): AppEmbeddedUser {
    return {
      id: user.id,
      biography: user.biography,
      iconImageId: user.iconImage?.id || null,
      name: user.name || null,
      username: user.username,
    }
  }

  toFeedPost(
    post: PrismaFeedPost & {
      quotation: PrismaFeedPost | null
      reply: PrismaFeedPost | null
    }
  ): AppFeedPost {
    return {
      ...this.toPost(post),
      user: this.toEmbededUser(post.user),
      quotation: post.quotation ? this.toQuotation(post.quotation) : null,
      reply: post.reply ? this.toQuotation(post.reply) : null,
    }
  }

  toFeed(feed: PrismaFeed): AppFeed {
    return {
      ...this.toFeedPost(feed.post),
      isRead: feed.isRead,
    }
  }

  toQuotation(quotation: PrismaFeedPost): AppQuotation {
    return {
      ...this.toPost(quotation),
      user: this.toEmbededUser(quotation.user),
    }
  }

  toProfile(user: PrismaProfile): AppProfile {
    return {
      id: user.id,
      createdAt: user.createdAt,
      username: user.username,
      name: user.name || null,
      biography: user.biography,
      iconImageId: user.iconImage?.id || null,
      headerImageId: user.headerImage?.id || null,
      siteURL: user.siteURL,
      isFollowee: (user.followers || []).length > 0,
      followeesCount: user.followeesCount,
      followersCount: user.followersCount,
    }
  }

  toUserMessage(message: PrismaUserMessage): AppUserMessage {
    return {
      id: message.id,
      createdAt: message.createdAt,
      isRead: message.isRead,
      text: message.text,
      updatedAt: message.updatedAt,
      user: this.toEmbededUser(message.user),
    }
  }

  toUserExchange(exchange: PrismaUserExchange): AppUserExchange {
    const [message] = exchange.messages

    return {
      id: exchange.id,
      createdAt: exchange.createdAt,
      isRead: exchange.isRead,
      lastMessage: {
        id: message.id,
        createdAt: message.createdAt,
        text: message.text,
        userId: message.userId,
      },
      relatedUser: this.toEmbededUser(exchange.relatedUser),
    }
  }

  toFollower(friendship: PrismaFollower): AppFollower {
    return {
      id: friendship.id,
      createdAt: friendship.createdAt,
      userId: friendship.follower.id,
      username: friendship.follower.username || null,
      name: friendship.follower.name || null,
      biography: friendship.follower.biography,
      isFollowee: friendship.follower.followersCount > 0,
      isFollower: friendship.follower.followeesCount > 0,
    }
  }

  toFollowee(friendship: PrismaFollowee): AppFollower {
    return {
      id: friendship.id,
      createdAt: friendship.createdAt,
      userId: friendship.followee.id,
      username: friendship.followee.username || null,
      name: friendship.followee.name || null,
      biography: friendship.followee.biography,
      isFollowee: friendship.followee.followeesCount > 0,
      isFollower: friendship.followee.followersCount > 0,
    }
  }

  toUserNotification(notification: PrismaUserNotification): AppNotification {
    if (notification.friendship !== null) {
      return {
        id: notification.id,
        createdAt: notification.createdAt,
        type: "FOLLOW",
        isRead: notification.isRead,
        embedded: this.toEmbededUser(notification.friendship.follower),
      }
    }

    if (notification.like !== null) {
      return {
        id: notification.id,
        createdAt: notification.createdAt,
        type: "LIKE",
        isRead: notification.isRead,
        embedded: {
          ...this.toLike(notification.like),
          user: this.toEmbededUser(notification.like.user),
        },
      }
    }

    if (notification.post !== null) {
      return {
        id: notification.id,
        createdAt: notification.createdAt,
        type: "POST",
        isRead: notification.isRead,
        embedded: this.toFeedPost(notification.post),
      }
    }

    return null
  }

  toSetting(setting: Setting): AppSetting {
    return {
      ...setting,
      fcmToken: setting.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
    }
  }
}
