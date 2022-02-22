import { File, Friendship, Like, Notification, Post } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"
import { PrismaPost } from "integrations/infrastructure/types/prismaPost"

export type PrismaNotification = Notification & {
  friendship: PrismaNotificationFriendship | null
  like: PrismaNotificationLike | null
  post: PrismaNotificationPost | null
}

type PrismaNotificationFriendship = Friendship & {
  follower: PrismaEmbeddedUser
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
  user: PrismaEmbeddedUser
}

type PrismaNotificationPost = Post & {
  files: File[]
  likes: Like[]
  quotation: PrismaPost | null
  quotations: Post[]
  replies: Post[]
  reply: PrismaPost | null
  user: PrismaEmbeddedUser
}
