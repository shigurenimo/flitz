import { LikeEntity } from "integrations/domain/entities"
import { Id } from "integrations/domain/valueObjects"

/**
 * いいね評価
 */
export abstract class LikeRepository {
  abstract find(userId: Id, postId: Id): Promise<LikeEntity | null>

  abstract upsert(likeEntity: LikeEntity): Promise<null>

  abstract delete(likeEntity: LikeEntity): Promise<null>
}
