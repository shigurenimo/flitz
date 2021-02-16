import type { Count, Username } from "integrations/domain/valueObjects"

/**
 * いいね評価
 */
export interface ILikeRepository {
  countLikes(input: { username: Username }): Promise<Count>
}
