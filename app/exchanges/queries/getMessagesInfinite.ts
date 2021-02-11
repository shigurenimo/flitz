import { resolver } from "blitz"
import { MessageService, PageService } from "integrations/domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "integrations/domain/valueObjects"
import { MessageRepository } from "integrations/infrastructure/repositories"
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
    const messageRepository = new MessageRepository()

    const {
      messages,
      messageEntities,
    } = await messageRepository.getUserExchangeMessages({
      relatedUserId,
      skip,
      userId,
    })

    const messageService = new MessageService()

    const hasUnreadMessages = messageService.hasUnreadMessages({
      messageEntities,
      userId,
    })

    if (hasUnreadMessages) {
      await messageRepository.markMesagesAsRead({ relatedUserId, userId })
    }

    const count = await messageRepository.countUserMessages({
      relatedUserId,
      userId,
    })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { messages, nextPage }
  }
)
