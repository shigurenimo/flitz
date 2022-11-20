import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import {
  CountGroupMessagesQuery,
  FindUserMessagesQuery,
  MarkMessagesAsReadService,
} from "service"

const zProps = z.object({
  recipientId: z.string(),
  skip: z.number(),
})

const getMessages = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      recipientId: new Id(props.recipientId),
      skip: props.skip,
      take: 40,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const query = container.resolve(FindUserMessagesQuery)

    const messages = await query.execute({
      relatedUserId: props.recipientId,
      skip: props.skip,
      userId: props.userId,
    })

    if (messages instanceof Error) {
      throw messages
    }

    const unreadMessages = messages.filter((message) => {
      if (message.user.id === props.userId.value) return false
      return !message.isRead
    })

    const hasUnreadMessages = 0 < unreadMessages.length

    const service = container.resolve(MarkMessagesAsReadService)

    if (hasUnreadMessages) {
      await service.execute({
        userId: props.userId,
        relatedUserId: props.recipientId,
      })
    }

    const countQuery = container.resolve(CountGroupMessagesQuery)

    const count = await countQuery.execute({
      userId: props.userId,
      relatedUserId: props.recipientId,
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
        return messages
      },
    })
  }
)

export default withSentry(getMessages, "getMessages")
