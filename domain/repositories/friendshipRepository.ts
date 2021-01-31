import type { Friendship, User } from "db"
import type { FriendshipEntity } from "domain/entities"
import type { Count, Id, Skip, Take, Username } from "domain/valueObjects"

/**
 * ## フォローフォロワー関係
 */
export interface IFriendshipRepository {
  countUserFollowees(input: { username: Username }): Promise<Count>

  countUserFollowers(input: { username: Username }): Promise<Count>

  getUserFollowers(input: { followeeId: Id }): any

  getUserFolloweesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<{
    friendships: Friendship[]
    friendshipEntities: FriendshipEntity[]
  }>

  getUserFollowersByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }): Promise<{
    friendships: (Friendship & {
      follower: User & {
        followees: Friendship[]
        followers: Friendship[]
      }
    })[]
    friendshipEntities: FriendshipEntity[]
  }>
}
