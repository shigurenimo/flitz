import type { Id } from "integrations/domain/valueObjects"

/**
 * フォローフォロワー関係
 */
export interface IFriendshipRepository {
  getUserFollowers(input: { followeeId: Id }): any
}
