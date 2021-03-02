import { Reference } from "db"
import { PrismaFeedPost } from "integrations/infrastructure/types/prismaFeedPost"

export type PrismaFeed = Reference & {
  post: PrismaFeedPost & {
    quotation: PrismaFeedPost | null
    reply: PrismaFeedPost | null
  }
}
