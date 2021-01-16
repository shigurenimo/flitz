import { Count, Id, PostText, Skip } from "app/domain/valueObjects"
import db from "db"

export class ExchangeRepository {
  static findUniqueExchange(input: { exchangeId: Id; skip: Skip }) {
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

  static findExchange(input: { userId: Id }) {
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

  static findUserExchanges(input: { skip: Skip; userId: Id }) {
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

  static async countUserExchanges(input: { userId: Id }) {
    const count = await db.exchange.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  static update(input: { text: PostText; userId: Id; exchangeId: Id }) {
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
