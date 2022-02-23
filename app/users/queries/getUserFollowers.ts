import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountFollowersQuery,
  FindFollowersQuery,
} from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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
    const findFollowersQuery = container.resolve(FindFollowersQuery)

    const friendships = await findFollowersQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    if (friendships instanceof Error) {
      throw friendships
    }

    const countFollowersQuery = container.resolve(CountFollowersQuery)

    const count = await countFollowersQuery.execute({
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
