import { PostRepository } from "app/domain/repositories"
import { PageService } from "app/domain/services"
import {
  Id,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "app/domain/valueObjects"
import { Ctx } from "blitz"
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

  const posts = await PostRepository.getRepliesByUsername({
    skip,
    take,
    userId,
    username,
  })

  const count = await PostRepository.countUserReplies({ username })

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  const isEmpty = posts.length === 0

  return { count, posts, nextPage, hasMore, isEmpty }
}

export default getUserRepliesInfinite
