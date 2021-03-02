import { resolver } from "blitz"
import {
  Id,
  MessageRepository,
  MessageService,
  PageService,
  Skip,
  Take,
  zId,
  zSkip,
} from "integrations/domain"
import {
  ExchangeMessageQuery,
  UserMessageQuery,
} from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetMessagesInfinite = z.object({
  relatedUserId: zId,
  skip: zSkip,
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
    const app = await createAppContext()

    const messages = await app.get(ExchangeMessageQuery).findManyByUserId({
      relatedUserId,
      skip,
      userId,
    })

    const hasUnreadMessages = app.get(MessageService).hasUnreadMessages({
      messages,
      userId,
    })

    if (hasUnreadMessages) {
      await app.get(MessageRepository).markAsRead(userId, relatedUserId)
    }

    const count = await app.get(UserMessageQuery).count(userId, relatedUserId)

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { messages, nextPage }
  }
)
