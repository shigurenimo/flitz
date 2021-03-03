import { QueryFeed } from "integrations/interface/types/queryFeed"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: QueryFeed[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return unreadReferences.length > 0
  }
}
