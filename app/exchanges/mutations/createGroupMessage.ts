import { resolver } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "integrations/domain/valueObjects"
import { ExchangeRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const CreateGroupMessage = z.object({
  exchangeId: idSchema,
  text: postTextSchema,
})

export default resolver.pipe(
  resolver.zod(CreateGroupMessage),
  resolver.authorize(),
  (input, ctx) => ({
    exchangeId: new Id(input.text),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async ({ exchangeId, text, userId }) => {
    const exchangeRepository = new ExchangeRepository()

    const { exchange } = await exchangeRepository.createExchangeMessage({
      exchangeId,
      text,
      userId,
    })

    const [message] = exchange.messages

    return message
  }
)
