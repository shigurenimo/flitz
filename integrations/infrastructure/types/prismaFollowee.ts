import { Friendship, User } from "db"

export type PrismaFollowee = Friendship & {
  followee: User & {
    followees: Friendship[]
    followers: Friendship[]
  }
}
