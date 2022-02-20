import { PrismaClient } from "@prisma/client"
import { enhancePrisma } from "blitz"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"

export default new EnhancedPrisma()
