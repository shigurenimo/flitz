import { File, Like, Post } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"

export type PrismaPost = Post & {
  files: File[]
  likes: Like[]
  quotations: Post[]
  replies: Post[]
  user: PrismaEmbeddedUser
}
