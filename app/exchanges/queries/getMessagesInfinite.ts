import { Ctx } from "blitz"
import { MessageService, PageService } from "domain/services"
import { Id, idSchema, Skip, skipSchema, Take } from "domain/valueObjects"
import { MessageRepository } from "infrastructure"
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

  const messages = await MessageRepository.getUserExchangeMessages({
    relatedUserId,
    skip,
    userId,
  })

  const hasUnreadMessages = MessageService.hasUnreadMessages({
    messages,
    userId,
  })

  if (hasUnreadMessages) {
    await MessageRepository.markMesagesAsRead({ relatedUserId, userId })
  }

  const count = await MessageRepository.countUserMessages({
    relatedUserId,
    userId,
  })

  const take = new Take()

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  return { messages, nextPage }
}

export default getMessagesInfinite
