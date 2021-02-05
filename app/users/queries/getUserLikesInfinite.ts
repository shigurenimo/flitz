import { resolver } from "blitz"
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

const GetUserLikesInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserLikesInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
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
)
