import type { Id } from "integrations/domain/valueObjects"

/**
 * タイムライン
 */
export interface IReferenceRepository {
  /**
   * TODO: 集約
   * @param input
   */
  markReferencesAsRead(input: { userId: Id }): Promise<null>
}
