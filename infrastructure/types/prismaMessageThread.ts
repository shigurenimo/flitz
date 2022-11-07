import { Message, MessageThread } from "db"
import { PrismaUserEmbedded } from "infrastructure/types"

export type PrismaMessageThread = MessageThread & {
  relatedUser: PrismaUserEmbedded
  messages: Message[]
}
