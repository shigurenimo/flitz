import { PostRepository } from "domain/repositories"
import { PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { Ctx } from "blitz"
import * as z from "zod"

const inputSchema = z.object({ skip: skipSchema })

const getPostsInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  const userId = ctx.session.userId === null ? null : new Id(ctx.session.userId)

  const skip = new Skip(input.skip)

  const posts = await PostRepository.getNewPosts({ skip, userId })

  const count = await PostRepository.countPosts()

  const take = new Take()

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  return { hasMore, posts, nextPage }
}

export default getPostsInfinite
