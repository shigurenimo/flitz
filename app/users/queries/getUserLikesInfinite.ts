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
import { LikeRepository } from "infrastructure/likeRepository"
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

  const likes = await LikeRepository.getLikes({
    skip,
    take,
    userId,
    username,
  })

  const count = await LikeRepository.countLikes({ username })

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  const isEmpty = likes.length === 0

  return { count, likes, nextPage, hasMore, isEmpty }
}

export default getUserLikesInfinite
