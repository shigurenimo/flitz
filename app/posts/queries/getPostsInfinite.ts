import { Ctx } from "blitz"
import { PageService } from "domain/services"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ skip: skipSchema })

const getPostsInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  const userId = ctx.session.userId === null ? null : new Id(ctx.session.userId)

  const skip = new Skip(input.skip)

  const postRepository = new PostRepository()

  const { posts } = await postRepository.getNewPosts({ skip, userId })

  const count = await postRepository.countPosts()

  const take = new Take()

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  return { hasMore, posts, nextPage }
}

export default getPostsInfinite
