import { Message } from "db"
import { PrismaEmbeddedUser } from "integrations/infrastructure/types/prismaEmbeddedUser"

export type PrismaMessage = Message & {
  user: PrismaEmbeddedUser
}
