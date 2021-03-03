import { FriendshipEntity } from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

/**
 * フォローフォロワー関係
 */
export abstract class FriendshipRepository {
  abstract find(
    followerId: Id,
    followeeId: Id
  ): Promise<FriendshipEntity | null>

  abstract findManyByFolloweeId(followeeId: Id): Promise<FriendshipEntity[]>

  abstract follow(friendshipEntity: FriendshipEntity): Promise<null>

  abstract unfollow(friendshipEntity: FriendshipEntity): Promise<null>
}
