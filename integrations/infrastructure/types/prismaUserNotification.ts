import { File, Friendship, Like, Notification, Post } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"
import { PrismaFeedPost } from "integrations/infrastructure/types/prismaFeedPost"

export type PrismaUserNotification = Notification & {
  friendship: PrismaUserNotificationFriendship | null
  like: PrismaUserNotificationLike | null
  post: PrismaUserNotificationPost | null
}

type PrismaUserNotificationFriendship = Friendship & {
  follower: PrismaEmbeddedUser
}

type PrismaUserNotificationLike = Like & {
  post: Post & {
    files: File[]
    likes: Like[]
    quotation: Post | null
    quotations: Post[]
    replies: Post[]
    reply: Post | null
  }
  user: PrismaEmbeddedUser
}

type PrismaUserNotificationPost = Post & {
  files: File[]
  likes: Like[]
  quotation: PrismaFeedPost | null
  quotations: Post[]
  replies: Post[]
  reply: PrismaFeedPost | null
  user: PrismaEmbeddedUser
}
