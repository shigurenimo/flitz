import { resolver } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "domain/valueObjects"
import { MessageRepository } from "infrastructure/repositories"
import * as z from "zod"

export const CreateMessage = z.object({
  text: postTextSchema,
  relatedUserId: idSchema,
})

export default resolver.pipe(
  resolver.zod(CreateMessage),
  resolver.authorize(),
  (input, ctx) => ({
    relatedUserId: new Id(input.relatedUserId),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async ({ relatedUserId, text, userId }) => {
    const messageRepository = new MessageRepository()

    const message = await messageRepository.createMessage({
      text,
      userId,
      relatedUserId,
    })

    return message
  }
)
