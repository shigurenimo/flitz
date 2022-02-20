import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import { CountLikesQuery, FindLikeQuery } from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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
    const findLikeQuery = container.resolve(FindLikeQuery)

    const likes = await findLikeQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const countLikesQuery = container.resolve(CountLikesQuery)

    const count = await countLikesQuery.execute({ username: props.username })

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
