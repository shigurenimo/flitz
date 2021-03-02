import { Message } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"

export type PrismaUserMessage = Message & {
  user: PrismaEmbeddedUser
}
