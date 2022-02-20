import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountRepliesByUsernameQuery,
  FindPostRepliesQuery,
} from "integrations/application"
import { Id, Username } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserReplies = resolver.pipe(
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
    const findPostRepliesQuery = container.resolve(FindPostRepliesQuery)

    const posts = await findPostRepliesQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    const countRepliesQuery = container.resolve(CountRepliesByUsernameQuery)

    const count = await countRepliesQuery.count({
      username: props.username,
    })

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

export default withSentry(getUserReplies, "getUserReplies")
