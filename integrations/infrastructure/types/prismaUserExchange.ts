import { Exchange, Message } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"

export type PrismaUserExchange = Exchange & {
  relatedUser: PrismaEmbeddedUser
  messages: Message[]
}
