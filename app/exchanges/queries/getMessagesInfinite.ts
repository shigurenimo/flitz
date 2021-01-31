import { Ctx } from "blitz"
import { MessageService, PageService } from "domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "domain/valueObjects"
import { MessageRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({
  skip: skipSchema,
  relatedUserId: idSchema,
})

const getMessagesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  ctx.session.authorize()

  inputSchema.parse(input)

  const relatedUserId = new Id(input.relatedUserId)

  const userId = new Id(ctx.session.userId)

  const skip = new Skip(input.skip)

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

  const take = new Take()

  const pageService = new PageService()

  const hasMore = pageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

  return { messages, nextPage }
}

export default getMessagesInfinite
