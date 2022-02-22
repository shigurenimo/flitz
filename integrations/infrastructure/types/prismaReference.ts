import { Reference } from "db"
import { PrismaPost } from "integrations/infrastructure/types/prismaPost"

export type PrismaReference = Reference & {
  post: PrismaPost & {
    quotation: PrismaPost | null
    reply: PrismaPost | null
  }
}
