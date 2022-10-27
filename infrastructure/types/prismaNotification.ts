import { File, Friendship, Like, Notification, Post } from "db"
import { PrismaQuotation } from "infrastructure/types/prismaQuotation"
import { PrismaUserEmbedded } from "infrastructure/types/prismaUserEmbedded"

export type PrismaNotification = Notification & {
  friendship: PrismaNotificationFriendship | null
  like: PrismaNotificationLike | null
  post: PrismaNotificationPost | null
}

type PrismaNotificationFriendship = Friendship & {
  follower: PrismaUserEmbedded
}

type PrismaNotificationLike = Like & {
  post: Post & {
    files: File[]
    likes: Like[]
    quotation: Post | null
    quotations: Post[]
    replies: Post[]
    reply: Post | null
  }
  user: PrismaUserEmbedded
}

type PrismaNotificationPost = Post & {
  files: File[]
  likes: Like[]
  quotation: PrismaQuotation | null
  quotations: Post[]
  replies: Post[]
  reply: PrismaQuotation | null
  user: PrismaUserEmbedded
}
