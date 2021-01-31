import { Ctx } from "blitz"
import { PageService } from "domain/services"
import {
  Id,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "domain/valueObjects"
import { FriendshipRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

const getUserFollowersInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  const userId = Id.nullable(ctx.session.userId)

  const skip = new Skip(input.skip)

  const take = new Take()

  const username = new Username(input.username)

  const friendshipRepository = new FriendshipRepository()

  const { friendships } = await friendshipRepository.getUserFollowersByUsername(
    {
      skip,
      take,
      userId,
      username,
    }
  )

  const count = await friendshipRepository.countUserFollowers({ username })

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  return { count, hasMore, friendships, nextPage }
}

export default getUserFollowersInfinite
