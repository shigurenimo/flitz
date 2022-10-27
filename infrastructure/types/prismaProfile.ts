import { File, Friendship, User } from "db"

export type PrismaProfile = User & {
  followers: Friendship[]
  iconImage: File | null
  headerImage: File | null
}
