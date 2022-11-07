import { PrismaReference } from "infrastructure/types"
import { toAppPost } from "infrastructure/utils/toAppPost"
import { AppFolloweePost } from "integrations/types"

export const toAppFolloweePost = (feed: PrismaReference): AppFolloweePost => {
  return {
    ...toAppPost(feed.post),
    isRead: feed.isRead,
  }
}
