import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { CountPostsQuery, FindLatestPostsQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
    const query = container.resolve(FindLatestPostsQuery)

    const posts = await query.execute({
      skip: props.skip,
      userId: props.userId,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countQuery = container.resolve(CountPostsQuery)

    const count = await countQuery.execute()

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
