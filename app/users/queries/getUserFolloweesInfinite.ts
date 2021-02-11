import { resolver } from "blitz"
import {
  Id,
  PageService,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "integrations/domain"
import { FriendshipRepository } from "integrations/infrastructure"
import * as z from "zod"

const GetUserFolloweesInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserFolloweesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const friendshipRepository = new FriendshipRepository()

    const {
      friendships,
    } = await friendshipRepository.getUserFolloweesByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await friendshipRepository.countUserFollowees({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { count, hasMore, friendships, nextPage }
  }
)
