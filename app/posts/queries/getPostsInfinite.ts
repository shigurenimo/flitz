import { paginate, resolver } from "blitz"
import { LatestPostQuery, PostQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetPostsInfinite = z.object({ skip: z.number() })

const getPostsInfinite = resolver.pipe(
  resolver.zod(zGetPostsInfinite),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const latestPostQuery = container.resolve(LatestPostQuery)

    const posts = await latestPostQuery.findMany({
      skip: props.skip,
      userId: props.userId,
    })

    const postQuery = container.resolve(PostQuery)

    const count = await postQuery.count()

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

export default getPostsInfinite
