import { resolver } from "blitz"
import { PageService } from "domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "domain/valueObjects"
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const GetRepliesInfinite = z.object({
  skip: skipSchema,
  replyId: idSchema,
})

export default resolver.pipe(
  resolver.zod(GetRepliesInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    replyId: new Id(input.replyId),
    skip: new Skip(input.skip),
    take: new Take(),
    userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
  }),
  async ({ replyId, skip, take, userId }) => {
    const postRepository = new PostRepository()

    const { posts } = await postRepository.getReplies({
      skip,
      take,
      replyId,
      userId,
    })

    const count = await postRepository.countReplies({ replyId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, posts, nextPage }
  }
)
