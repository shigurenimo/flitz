import { paginate, resolver } from "blitz"
import {
  ExchangeMessageQuery,
  UserMessageQuery,
} from "integrations/application"
import { Id } from "integrations/domain"
import { MessageRepository } from "integrations/infrastructure"
import { container } from "tsyringe"
import { z } from "zod"

const zGetMessagesInfinite = z.object({
  relatedUserId: z.string(),
  skip: z.number(),
})

const getMessagesInfinite = resolver.pipe(
  resolver.zod(zGetMessagesInfinite),
  resolver.authorize(),
  (props, ctx) => {
    return {
      relatedUserId: new Id(props.relatedUserId),
      skip: props.skip,
      take: 40,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const exchangeMessageQuery = container.resolve(ExchangeMessageQuery)

    const messages = await exchangeMessageQuery.findManyByUserId({
      relatedUserId: props.relatedUserId,
      skip: props.skip,
      userId: props.userId,
    })

    const unreadMessages = messages.filter((message) => {
      if (message.user.id === props.userId.value) return false
      return !message.isRead
    })

    const hasUnreadMessages = unreadMessages.length > 0

    // TODO: BAD
    const messageRepository = container.resolve(MessageRepository)

    if (hasUnreadMessages) {
      // TODO: BAD
      await messageRepository.markAsRead(props.userId, props.relatedUserId)
    }

    const userMessageQuery = container.resolve(UserMessageQuery)

    const count = await userMessageQuery.count(
      props.userId,
      props.relatedUserId
    )

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

export default getMessagesInfinite
