import { PostRepository } from "app/domain/repositories"
import { PageService } from "app/domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "app/domain/valueObjects"
import { Ctx } from "blitz"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  replyId: idSchema,
})

const transformer = z.transformer(
  inputSchema,
  z.object({
    skip: z.instanceof(Skip),
    replyId: z.instanceof(Id),
  }),
  (input) => {
    return {
      skip: new Skip(input.skip),
      replyId: new Id(input.replyId),
    }
  }
)

const getRepliesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  const { replyId, skip } = transformer.parse(input)

  const userId = ctx.session.userId === null ? null : new Id(ctx.session.userId)

  const take = new Take()

  const posts = await PostRepository.getReplies({
    skip,
    take,
    replyId,
    userId,
  })

  const count = await PostRepository.countReplies({ replyId })

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  return { hasMore, posts, nextPage }
}

export default getRepliesInfinite
