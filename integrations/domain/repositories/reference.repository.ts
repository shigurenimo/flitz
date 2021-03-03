import type { Id } from "integrations/domain/valueObjects"

/**
 * タイムライン
 */
export abstract class ReferenceRepository {
  /**
   * @param input
   */
  abstract markAsRead(userId: Id): Promise<null>
}
