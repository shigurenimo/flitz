import { resolver } from "blitz"
import { PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const GetPostsInfinite = z.object({ skip: skipSchema })

export default resolver.pipe(
  resolver.zod(GetPostsInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async ({ skip, take, userId }) => {
    const postRepository = new PostRepository()

    const { posts } = await postRepository.getNewPosts({ skip, userId })

    const count = await postRepository.countPosts()

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, posts, nextPage }
  }
)
