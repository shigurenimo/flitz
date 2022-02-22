import { Message } from "db"
import { PrismaUserEmbedded } from "integrations/infrastructure/types/prismaUserEmbedded"

export type PrismaMessage = Message & {
  user: PrismaUserEmbedded
}
