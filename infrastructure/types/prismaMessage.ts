import { Message } from "db"
import { PrismaUserEmbedded } from "infrastructure/types/prismaUserEmbedded"

export type PrismaMessage = Message & {
  user: PrismaUserEmbedded
}
