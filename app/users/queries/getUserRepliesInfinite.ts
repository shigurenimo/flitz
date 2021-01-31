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
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

const getUserRepliesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  const userId = Id.nullable(ctx.session.userId)

  const skip = new Skip(input.skip)

  const take = new Take()

  const username = new Username(input.username)

  const postRepository = new PostRepository()

  const { posts } = await postRepository.getRepliesByUsername({
    skip,
    take,
    userId,
    username,
  })

  const count = await postRepository.countUserReplies({ username })

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  const isEmpty = posts.length === 0

  return { count, posts, nextPage, hasMore, isEmpty }
}

export default getUserRepliesInfinite
