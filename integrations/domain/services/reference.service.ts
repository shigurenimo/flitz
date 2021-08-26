import { AppFeed } from "integrations/interface/types/appFeed"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: AppFeed[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return unreadReferences.length > 0
  }
}
