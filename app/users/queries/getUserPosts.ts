import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import {
  CountUserPostsQuery,
  FindUserPostsQuery,
} from "integrations/application"
import { Id, Username } from "integrations/domain"

const zProps = z.object({
  skip: z.number(),
  username: z.string(),
})

const getUserPosts = resolver.pipe(
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
    const findUserPostsQuery = container.resolve(FindUserPostsQuery)

    const posts = await findUserPostsQuery.execute({
      skip: props.skip,
      take: props.take,
      userId: props.userId,
      username: props.username,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countUserPostsQuery = container.resolve(CountUserPostsQuery)

    const count = await countUserPostsQuery.execute({
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
        return posts
      },
    })
  }
)

export default withSentry(getUserPosts, "getUserPosts")
