import { paginate, resolver } from "blitz"
import { UserReplyQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUserRepliesInfinite = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserRepliesInfinite = resolver.pipe(
  resolver.zod(zGetUserRepliesInfinite),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const userReplyQuery = container.resolve(UserReplyQuery)

    const posts = await userReplyQuery.findMany({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const count = await userReplyQuery.count(props.username)

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

export default getUserRepliesInfinite
