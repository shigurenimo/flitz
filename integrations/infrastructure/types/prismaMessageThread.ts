import { Message, MessageThread } from "db"
import { PrismaUserEmbedded } from "integrations/infrastructure/types"

export type prismaMessageThread = MessageThread & {
  relatedUser: PrismaUserEmbedded
  messages: Message[]
}
