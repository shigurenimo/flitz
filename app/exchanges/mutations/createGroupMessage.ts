import { Ctx } from "blitz"
import { Id, idSchema, PostText, postTextSchema } from "domain/valueObjects"
import { ExchangeRepository } from "infrastructure/exchangeRepository"
import * as z from "zod"

const inputSchema = z.object({
  text: postTextSchema,
  exchangeId: idSchema,
})

const createGroupMessage = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const text = new PostText(input.text)

  const exchangeId = new Id(input.exchangeId)

  const exchange = await ExchangeRepository.createExchangeMessage({
    exchangeId,
    text,
    userId,
  })

  const [message] = exchange.messages

  return message
}

export default createGroupMessage
