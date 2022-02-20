import { paginate, resolver } from "blitz"
import { ReplyQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetRepliesInfinite = z.object({
  skip: z.number(),
  replyId: z.string(),
})

const getRepliesInfinite = resolver.pipe(
  resolver.zod(zGetRepliesInfinite),
  (props, ctx) => {
    return {
      replyId: new Id(props.replyId),
      skip: props.skip,
      take: 40,
      userId: ctx.session.userId === null ? null : new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const replyQuery = container.resolve(ReplyQuery)

    const posts = await replyQuery.findMany({
      skip: props.skip,
      take: props.take,
      replyId: props.replyId,
      userId: props.userId,
    })

    const count = await replyQuery.count({ replyId: props.replyId })

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

export default getRepliesInfinite
