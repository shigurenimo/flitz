import { File, Like, Post } from "db"
import { PrismaUserEmbedded } from "infrastructure/types"

export type PrismaQuotation = Post & {
  files: File[]
  likes: Like[]
  quotations: Post[]
  replies: Post[]
  user: PrismaUserEmbedded
}
