import {
  resolveGetUserFolloweesInfinite,
  zGetUserFolloweesInfinite,
} from "app/users/queries/validations/getUserFolloweesInfinite"
import { resolver } from "blitz"
import { PageService } from "integrations/domain"
import { UserFolloweeQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zGetUserFolloweesInfinite),
  resolveGetUserFolloweesInfinite,
  async ({ skip, take, userId, username }) => {
    const app = await createAppContext()

    const friendships = await app.get(UserFolloweeQuery).findByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await app.get(UserFolloweeQuery).count({ username })

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { count, hasMore, friendships, nextPage }
  }
)
