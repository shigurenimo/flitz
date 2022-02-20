import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountFolloweesQuery,
  FindFolloweesQuery,
} from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserFollowees = resolver.pipe(
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
    const findFolloweesQuery = container.resolve(FindFolloweesQuery)

    const friendships = await findFolloweesQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    if (friendships instanceof Error) {
      throw friendships
    }

    const countFolloweesQuery = container.resolve(CountFolloweesQuery)

    const count = await countFolloweesQuery.execute({
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

export default withSentry(getUserFollowees, "getUserFollowees")
