import { paginate, resolver } from "blitz"
import { UserFolloweerQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetUserFollowersInfinite = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserFollowersInfinite = resolver.pipe(
  resolver.zod(zGetUserFollowersInfinite),
  (input, ctx) => ({
    skip: input.skip,
    take: 40,
    userId: ctx.session.userId ? new Id(ctx.session.userId) : null,
    username: new Username(input.username),
  }),
  async (props) => {
    const userFolloweerQuery = container.resolve(UserFolloweerQuery)

    const friendships = await userFolloweerQuery.findByUsername({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const count = await userFolloweerQuery.count({ username: props.username })

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

export default getUserFollowersInfinite
