import { PrismaQuotation } from "integrations/infrastructure/types"

export type PrismaPost = PrismaQuotation & {
  quotation: PrismaQuotation | null
  reply: PrismaQuotation | null
}
