import { resolver } from "blitz"
import {
  Id,
  PageService,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "integrations/domain"
import { UserPostQuery } from "integrations/infrastructure"
import * as z from "zod"

const GetUserPostsInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserPostsInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const userPostQuery = new UserPostQuery()

    const posts = await userPostQuery.findMany({ skip, take, userId, username })

    const count = await userPostQuery.count({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    const isEmpty = posts.length === 0

    return { count, posts, nextPage, hasMore, isEmpty }
  }
)
