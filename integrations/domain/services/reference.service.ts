import { AppFolloweePost } from "integrations/types/appFolloweePost"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: AppFolloweePost[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return unreadReferences.length > 0
  }
}
