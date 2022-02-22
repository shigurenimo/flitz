import { Reference } from "db"
import { PrismaQuotation } from "integrations/infrastructure/types/prismaQuotation"

export type PrismaReference = Reference & {
  post: PrismaQuotation & {
    quotation: PrismaQuotation | null
    reply: PrismaQuotation | null
  }
}
