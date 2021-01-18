import { Reference } from "db"

/**
 * ## タイムライン
 */
export class ReferenceService {
  static hasUnreadReferences(input: { references: Reference[] }) {
    const unreadReferences = input.references.filter((reference) => {
      return !reference.isRead
    })

    return unreadReferences.length > 0
  }
}
