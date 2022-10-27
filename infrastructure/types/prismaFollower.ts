import { Friendship, User } from "db"

export type PrismaFollower = Friendship & {
  follower: User & {
    followees: Friendship[]
    followers: Friendship[]
  }
}
