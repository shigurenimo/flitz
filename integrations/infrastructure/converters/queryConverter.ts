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
import { QueryEmbeddedUser } from "integrations/interface/types/queryEmbeddedUser"
import { QueryUserExchange } from "integrations/interface/types/queryExchangeMessage"
import { QueryFeed } from "integrations/interface/types/queryFeed"
import { QueryFeedPost } from "integrations/interface/types/queryFeedPost"
import { QueryFollower } from "integrations/interface/types/queryFollower"
import { QueryLikePost } from "integrations/interface/types/queryLikePost"
import { QueryNotification } from "integrations/interface/types/queryNotification"
import { QueryPost } from "integrations/interface/types/queryPost"
import { QueryProfile } from "integrations/interface/types/queryProfile"
import { QueryQuotation } from "integrations/interface/types/queryQuotation"
import { QuerySetting } from "integrations/interface/types/querySetting"
import { QueryUserMessage } from "integrations/interface/types/queryUserMessage"

export class QueryConverter {
  toPost(
    post: Post & {
      files: File[]
      likes: Like[]
      quotations: Post[]
      replies: Post[]
    }
  ): QueryPost {
    return {
      id: post.id,
      createdAt: post.createdAt,
      fileIds: post.files.map((file) => file.id),
      likesCount: post.likesCount,
      quotationsCount: post.quotationsCount,
      repliesCount: post.repliesCount,
      hasLike: post.likes.length > 0,
      hasQuotation: post.quotations.length > 0,
      hasReply: post.replies.length > 0,
      text: post.text || null,
    }
  }

  toLike(like: { post: Post }): QueryLikePost {
    return {
      id: like.post.id,
      createdAt: like.post.createdAt,
      text: like.post.text || null,
    }
  }

  toEmbededUser(user: PrismaEmbeddedUser): QueryEmbeddedUser {
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
  ): QueryFeedPost {
    return {
      ...this.toPost(post),
      user: this.toEmbededUser(post.user),
      quotation: post.quotation ? this.toQuotation(post.quotation) : null,
      reply: post.reply ? this.toQuotation(post.reply) : null,
    }
  }

  toFeed(feed: PrismaFeed): QueryFeed {
    return {
      ...this.toFeedPost(feed.post),
      isRead: feed.isRead,
    }
  }

  toQuotation(quotation: PrismaFeedPost): QueryQuotation {
    return {
      ...this.toPost(quotation),
      user: this.toEmbededUser(quotation.user),
    }
  }

  toProfile(user: PrismaProfile): QueryProfile {
    return {
      id: user.id,
      createdAt: user.createdAt,
      username: user.username,
      name: user.name || null,
      biography: user.biography,
      iconImageId: user.iconImage?.id || null,
      headerImageId: user.headerImage?.id || null,
      siteURL: user.siteURL,
      isFollowee: user.followers.length > 0,
      followeesCount: user.followeesCount,
      followersCount: user.followersCount,
    }
  }

  toUserMessage(message: PrismaUserMessage): QueryUserMessage {
    return {
      id: message.id,
      createdAt: message.createdAt,
      isRead: message.isRead,
      text: message.text,
      updatedAt: message.updatedAt,
      user: this.toEmbededUser(message.user),
    }
  }

  toUserExchange(exchange: PrismaUserExchange): QueryUserExchange {
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

  toFollower(friendship: PrismaFollower): QueryFollower {
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

  toFollowee(friendship: PrismaFollowee): QueryFollower {
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

  toUserNotification(notification: PrismaUserNotification): QueryNotification {
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

  toSetting(setting: Setting): QuerySetting {
    return {
      ...setting,
      fcmToken: setting.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
    }
  }
}
