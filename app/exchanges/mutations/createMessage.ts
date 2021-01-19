import { MessageRepository } from "domain/repositories/messageRepository"
import { Id, idSchema } from "domain/valueObjects/id"
import { PostText, postTextSchema } from "domain/valueObjects/postText"
import { Ctx } from "blitz"
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

  const message = await MessageRepository.createMessage({
    text,
    userId,
    relatedUserId: new Id(input.relatedUserId),
  })

  return message
}

export default createMessage
