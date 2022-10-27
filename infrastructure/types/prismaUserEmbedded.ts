import { File, User } from "db"

export type PrismaUserEmbedded = User & {
  iconImage: File | null
}
