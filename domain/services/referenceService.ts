import type { ReferenceEntity } from "domain/entities"

/**
 * ## タイムライン
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
