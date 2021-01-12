import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = {
  text: string
  relatedUserId: string
}

const createMessage = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (input.text.trim().length === 0) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const message = await db.message.create({
    data: {
      text: input.text,
      user: { connect: { id: userId } },
      exchanges: {
        connectOrCreate: [
          {
            create: {
              isRead: true,
              relatedUser: { connect: { id: input.relatedUserId } },
              user: { connect: { id: userId } },
            },
            where: {
              userId_relatedUserId: {
                relatedUserId: input.relatedUserId,
                userId,
              },
            },
          },
          {
            create: {
              isRead: false,
              relatedUser: { connect: { id: userId } },
              user: { connect: { id: input.relatedUserId } },
            },
            where: {
              userId_relatedUserId: {
                relatedUserId: userId,
                userId: input.relatedUserId,
              },
            },
          },
        ],
      },
    },
  })

  return message
}

export default createMessage
