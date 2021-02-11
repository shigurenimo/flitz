import type { ReferenceEntity } from "integrations/domain/entities"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnreadReferences(input: { referenceEntities: ReferenceEntity[] }) {
    const unreadReferences = input.referenceEntities.filter(
      (referenceEntity) => {
        return !referenceEntity.isRead
      }
    )

    return unreadReferences.length > 0
  }
}
