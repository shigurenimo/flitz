import { AppFolloweePost } from "infrastructure/models"
import { PrismaReference } from "infrastructure/types"
import { toAppPost } from "infrastructure/utils/toAppPost"

export const toAppFolloweePost = (feed: PrismaReference): AppFolloweePost => {
  return {
    ...toAppPost(feed.post),
    isRead: feed.isRead,
  }
}
