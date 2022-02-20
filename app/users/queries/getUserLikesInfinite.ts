import { paginate, resolver } from "blitz"
import { UserLikeQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUserLikesInfinite = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserLikesInfinite = resolver.pipe(
  resolver.zod(zGetUserLikesInfinite),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const userLikeQuery = container.resolve(UserLikeQuery)

    const likes = await userLikeQuery.findMany({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const count = await userLikeQuery.count(props.username)

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return likes
      },
    })
  }
)

export default getUserLikesInfinite
