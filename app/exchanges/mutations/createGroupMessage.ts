import { ExchangeRepository } from "app/domain/repositories/exchangeRepository"
import { Id, idSchema } from "app/domain/valueObjects/id"
import { PostText, postTextSchema } from "app/domain/valueObjects/postText"
import { Ctx } from "blitz"
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

  const exchange = await ExchangeRepository.update({
    exchangeId,
    text,
    userId,
  })

  const [message] = exchange.messages

  return message
}

export default createGroupMessage
