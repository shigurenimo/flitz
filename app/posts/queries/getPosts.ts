import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import { CountPostsQuery, FindLatestPostsQuery } from "integrations/application"
import { Id } from "integrations/domain"

const zProps = z.object({
  skip: z.number(),
})

const getPosts = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findLatestPostsQuery = container.resolve(FindLatestPostsQuery)

    const posts = await findLatestPostsQuery.execute({
      skip: props.skip,
      userId: props.userId,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countPostsQuery = container.resolve(CountPostsQuery)

    const count = await countPostsQuery.execute()

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
        return posts
      },
    })
  }
)

export default withSentry(getPosts, "getPosts")
