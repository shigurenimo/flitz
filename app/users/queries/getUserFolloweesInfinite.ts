import {
  resolveGetUserFolloweesInfinite,
  zGetUserFolloweesInfinite,
} from "app/users/queries/validations/getUserFolloweesInfinite"
import { resolver } from "blitz"
import { PageService } from "integrations/domain"
import { UserFolloweeQuery } from "integrations/infrastructure"

export default resolver.pipe(
  resolver.zod(zGetUserFolloweesInfinite),
  resolveGetUserFolloweesInfinite,
  async ({ skip, take, userId, username }) => {
    const userFolloweeQuery = new UserFolloweeQuery()

    const friendships = await userFolloweeQuery.findByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await userFolloweeQuery.count({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { count, hasMore, friendships, nextPage }
  }
)
