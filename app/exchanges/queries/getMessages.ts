import { paginate, resolver } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { withSentry } from "app/core/utils/withSentry"
import {
  CountGroupMessagesQuery,
  FindUserMessagesQuery,
  MarkMessagesAsReadService,
} from "integrations/application"
import { Id } from "integrations/domain"

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
    const findUserMessagesQuery = container.resolve(FindUserMessagesQuery)

    const messages = await findUserMessagesQuery.execute({
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

    const hasUnreadMessages = unreadMessages.length > 0

    const markMessagesAsReadService = container.resolve(
      MarkMessagesAsReadService
    )

    if (hasUnreadMessages) {
      await markMessagesAsReadService.execute({
        userId: props.userId,
        relatedUserId: props.recipientId,
      })
    }

    const countGroupMessagesQuery = container.resolve(CountGroupMessagesQuery)

    const count = await countGroupMessagesQuery.execute({
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
