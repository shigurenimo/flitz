import { Reference } from "db"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: Reference[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return unreadReferences.length > 0
  }
}
