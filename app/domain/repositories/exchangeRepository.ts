import { Count, Id, PostText, Skip } from "app/domain/valueObjects"
import db from "db"

export class ExchangeRepository {
  static async countUserExchanges(input: { userId: Id }) {
    const count = await db.exchange.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  static getExchange(input: { exchangeId: Id; skip: Skip }) {
    return db.exchange.findUnique({
      include: {
        user: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 20,
          skip: input.skip.value,
        },
      },
      where: { id: input.exchangeId.value },
    })
  }

  static getUserExchange(input: { userId: Id }) {
    return db.exchange.findFirst({
      where: {
        messages: {
          some: {
            isRead: false,
            userId: { not: input.userId.value },
          },
        },
        userId: input.userId.value,
      },
    })
  }

  static getUserExchanges(input: { skip: Skip; userId: Id }) {
    return db.exchange.findMany({
      orderBy: { updatedAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { user: true },
        },
        relatedUser: true,
      },
    })
  }

  static createExchangeMessage(input: {
    text: PostText
    userId: Id
    exchangeId: Id
  }) {
    return db.exchange.update({
      data: {
        messages: {
          create: {
            text: input.text.value,
            user: { connect: { id: input.userId.value } },
          },
        },
      },
      include: { messages: true },
      where: { id: input.exchangeId.value },
    })
  }
}
