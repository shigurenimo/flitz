import { Ctx } from "blitz"
import { PageService } from "domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "domain/valueObjects"
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  replyId: idSchema,
})

const getRepliesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  const { replyId, skip } = inputSchema
    .transform((input) => ({
      skip: new Skip(input.skip),
      replyId: new Id(input.replyId),
    }))
    .parse(input)

  const userId = ctx.session.userId === null ? null : new Id(ctx.session.userId)

  const take = new Take()

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

export default getRepliesInfinite
