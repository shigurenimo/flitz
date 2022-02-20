import { paginate, resolver } from "blitz"
import { UserPostQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUserPostsInfinite = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserPostsInfinite = resolver.pipe(
  resolver.zod(zGetUserPostsInfinite),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const userPostQuery = container.resolve(UserPostQuery)

    const posts = await userPostQuery.findMany({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const count = await userPostQuery.count({ username: props.username })

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return posts
      },
    })
  }
)

export default getUserPostsInfinite
