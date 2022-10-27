import { AppFolloweePost } from "integrations/types/appFolloweePost"

/**
 * タイムライン
 */
export class ReferenceService {
  hasUnread(input: { references: AppFolloweePost[] }) {
    const unreadReferences = input.references.filter((referenceEntity) => {
      return !referenceEntity.isRead
    })

    return 0 < unreadReferences.length
  }
}
