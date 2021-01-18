import { Count, Id, PostText, Skip } from "app/domain/valueObjects"
import db from "db"

/**
 * ## メッセージスレッド
 */
export class ExchangeRepository {
  /**
   * ユーザーのスレッドを集計する
   * @param input
   * @returns
   */
  static async countUserExchanges(input: { userId: Id }) {
    const count = await db.exchange.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  /**
   * スレッドを取得する
   * @param input
   * @returns
   */
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

  /**
   * ユーザーのスレッドを取得する
   * @param input
   * @returns
   */
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

  /**
   * ユーザーの複数のスレッドを取得する
   * @param input
   * @returns
   */
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

  /**
   * スレッドのメッセージを作成する
   * @param input
   * @returns
   */
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
