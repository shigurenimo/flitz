import { PostEntity } from "integrations/domain/entities"
import { Id } from "integrations/domain/valueObjects"

/**
 * 投稿
 */
export abstract class PostRepository {
  /**
   *
   * @param id
   */
  abstract find(id: Id): Promise<PostEntity | null>

  /**
   * @param input
   */
  abstract upsert(postEntity: PostEntity): Promise<null>

  /**
   * @deprecated
   * @param input
   */
  abstract upsertReply(postEntity: PostEntity): Promise<null>

  /**
   * @deprecated
   * @param input
   */
  abstract upsertQuotation(postEntity: PostEntity): Promise<null>

  abstract delete(postEntity: PostEntity): Promise<null>
}
