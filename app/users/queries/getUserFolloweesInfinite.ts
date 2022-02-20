import { paginate, resolver } from "blitz"
import { UserFolloweeQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUserFolloweesInfinite = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserFolloweesInfinite = resolver.pipe(
  resolver.zod(zGetUserFolloweesInfinite),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
      username: new Username(props.username),
    }
  },
  async (props) => {
    const userFolloweeQuery = container.resolve(UserFolloweeQuery)

    const friendships = await userFolloweeQuery.findByUsername({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const count = await userFolloweeQuery.count({ username: props.username })

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

export default getUserFolloweesInfinite
