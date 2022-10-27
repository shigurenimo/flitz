import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountFollowersQuery, FindFollowersQuery } from "application"
import { Id, Username } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zProps = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserFollowers = resolver.pipe(
  resolver.zod(zProps),
  (input, ctx) => {
    return {
      skip: input.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(input.username),
    }
  },
  async (props) => {
    const query = container.resolve(FindFollowersQuery)

    const friendships = await query.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    if (friendships instanceof Error) {
      throw friendships
    }

    const countQuery = container.resolve(CountFollowersQuery)

    const count = await countQuery.execute({
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
        return friendships
      },
    })
  }
)

export default withSentry(getUserFollowers, "getUserFollowers")
