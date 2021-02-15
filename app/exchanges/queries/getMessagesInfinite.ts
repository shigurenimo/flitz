import { resolver } from "blitz"
import {
  Id,
  idSchema,
  MessageService,
  PageService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import {
  ExchangeMessageQuery,
  MessageRepository,
  UserMessageQuery,
} from "integrations/infrastructure"
import * as z from "zod"

const GetMessagesInfinite = z.object({
  relatedUserId: idSchema,
  skip: skipSchema,
})

export default resolver.pipe(
  resolver.zod(GetMessagesInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    relatedUserId: new Id(input.relatedUserId),
    skip: new Skip(input.skip),
    take: new Take(),
    userId: new Id(ctx.session.userId),
  }),
  async ({ relatedUserId, skip, take, userId }) => {
    const exchangeMessageQuery = new ExchangeMessageQuery()

    const messages = await exchangeMessageQuery.findManyByUserId({
      relatedUserId,
      skip,
      userId,
    })

    const messageService = new MessageService()

    const hasUnreadMessages = messageService.hasUnreadMessages({
      messages,
      userId,
    })

    if (hasUnreadMessages) {
      const messageRepository = new MessageRepository()

      await messageRepository.markMesagesAsRead({ relatedUserId, userId })
    }

    const userMessageQuery = new UserMessageQuery()

    const count = await userMessageQuery.count({ relatedUserId, userId })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { messages, nextPage }
  }
)
