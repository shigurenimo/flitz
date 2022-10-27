import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountUserLikesQuery, FindUserLikeQuery } from "application"
import { Id, Username } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserLikes = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const findUserLikeQuery = container.resolve(FindUserLikeQuery)

    const likes = await findUserLikeQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    if (likes instanceof Error) {
      throw likes
    }

    const countUserLikesQuery = container.resolve(CountUserLikesQuery)

    const count = await countUserLikesQuery.execute({
      username: props.username,
    })

    if (count instanceof Error) {
      throw count
    }

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

export default withSentry(getUserLikes, "getUserLikes")
