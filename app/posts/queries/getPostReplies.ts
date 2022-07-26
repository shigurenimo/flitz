import { paginate, resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import {
  CountPostRepliesQuery,
  FindUserRepliesQuery,
} from "integrations/application"
import { Id } from "integrations/domain"

const zProps = z.object({
  skip: z.number(),
  replyId: z.string(),
})

const getPostReplies = resolver.pipe(
  resolver.zod(zProps),
  (props, ctx) => {
    return {
      replyId: new Id(props.replyId),
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findUserRepliesQuery = container.resolve(FindUserRepliesQuery)

    const posts = await findUserRepliesQuery.execute({
      skip: props.skip,
      take: props.take,
      replyId: props.replyId,
      userId: props.userId,
    })

    if (posts instanceof Error) {
      throw posts
    }

    const countPostRepliesQuery = container.resolve(CountPostRepliesQuery)

    const count = await countPostRepliesQuery.execute({
      replyId: props.replyId,
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

export default withSentry(getPostReplies, "getPostReplies")
