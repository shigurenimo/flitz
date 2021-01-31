import { Ctx } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "domain/valueObjects"
import { MessageRepository } from "infrastructure/repositories"
import * as z from "zod"

export const inputSchema = z.object({
  text: postTextSchema,
  relatedUserId: idSchema,
})

const createMessage = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const text = new PostText(input.text)

  const userId = new Id(ctx.session.userId)

  const messageRepository = new MessageRepository()

  const message = await messageRepository.createMessage({
    text,
    userId,
    relatedUserId: new Id(input.relatedUserId),
  })

  return message
}

export default createMessage
