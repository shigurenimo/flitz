import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = {
  text: string
  exchangeId: string
}

const createGroupMessage = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (input.text.trim().length === 0) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const exchange = await db.exchange.update({
    data: {
      messages: {
        create: {
          text: input.text,
          user: { connect: { id: userId } },
        },
      },
    },
    include: { messages: true },
    where: { id: input.exchangeId },
  })

  const [message] = exchange.messages

  return message
}

export default createGroupMessage
