import { Reference } from "db"
import { PrismaQuotation } from "infrastructure/types/prismaQuotation"

export type PrismaReference = Reference & {
  post: PrismaQuotation & {
    quotation: PrismaQuotation | null
    reply: PrismaQuotation | null
  }
}
