import { paginate, resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import {
  CountUserLikesQuery,
  FindUserLikeQuery,
} from "integrations/application"
import { Id, Username } from "integrations/domain"

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
