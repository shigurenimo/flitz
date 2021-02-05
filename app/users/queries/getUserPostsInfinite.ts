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
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const GetUserPostsInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserPostsInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const postRepository = new PostRepository()

    const { posts } = await postRepository.getPostsByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await postRepository.countUserPosts({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = posts.length === 0

    return { count, posts, nextPage, hasMore, isEmpty }
  }
)
