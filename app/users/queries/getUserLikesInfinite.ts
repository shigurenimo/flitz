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
import { LikeRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

const getUserLikesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  const userId = Id.nullable(ctx.session.userId)

  const username = new Username(input.username)

  const skip = new Skip(input.skip)

  const take = new Take()

  const likeRepository = new LikeRepository()

  const { likes } = await likeRepository.getLikes({
    skip,
    take,
    userId,
    username,
  })

  const count = await likeRepository.countLikes({ username })

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  const isEmpty = likes.length === 0

  return { count, likes, nextPage, hasMore, isEmpty }
}

export default getUserLikesInfinite
