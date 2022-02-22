import { Message, MessageThread } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types"

export type prismaMessageThread = MessageThread & {
  relatedUser: PrismaEmbeddedUser
  messages: Message[]
}
