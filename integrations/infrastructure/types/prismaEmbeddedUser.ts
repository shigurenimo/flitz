import { File, User } from "db"

export type PrismaEmbeddedUser = User & {
  iconImage: File | null
}
