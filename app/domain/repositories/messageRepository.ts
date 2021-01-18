import { Count, Skip } from "app/domain/valueObjects"
import { Id } from "app/domain/valueObjects/id"
import { PostText } from "app/domain/valueObjects/postText"
import db from "db"

/**
 * ## メッセージ
 */
export class MessageRepository {
  static async countUserGroupMessages(input: { exchangeId: Id }) {
    const count = await db.message.count({
      where: { id: input.exchangeId.value },
    })

    return new Count(count)
  }

  static async countUserMessages(input: { relatedUserId: Id; userId: Id }) {
    const count = await db.message.count({
      where: {
        exchanges: {
          some: {
            userId: input.userId.value,
            relatedUserId: input.relatedUserId.value,
          },
        },
      },
    })

    return new Count(count)
  }

  static async markMesagesAsRead(input: { relatedUserId: Id; userId: Id }) {
    return db.message.updateMany({
      data: { isRead: true },
      where: {
        exchanges: {
          some: {
            userId: input.userId.value,
            relatedUserId: input.relatedUserId.value,
            isRead: false,
          },
        },
      },
    })
  }

  static async getUserExchangeMessages(input: {
    relatedUserId: Id
    skip: Skip
    userId: Id
  }) {
    return db.message.findMany({
      include: {
        user: true,
        exchanges: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 20,
      where: {
        exchanges: {
          some: {
            userId: input.userId.value,
            relatedUsers: { every: { id: input.relatedUserId.value } },
          },
        },
      },
    })
  }

  static createMessage(input: {
    text: PostText
    userId: Id
    relatedUserId: Id
  }) {
    return db.message.create({
      data: {
        text: input.text.value,
        user: { connect: { id: input.userId.value } },
        exchanges: {
          connectOrCreate: [
            {
              create: {
                isRead: true,
                relatedUser: { connect: { id: input.relatedUserId.value } },
                user: { connect: { id: input.userId.value } },
              },
              where: {
                userId_relatedUserId: {
                  relatedUserId: input.relatedUserId.value,
                  userId: input.userId.value,
                },
              },
            },
            {
              create: {
                isRead: false,
                relatedUser: { connect: { id: input.userId.value } },
                user: { connect: { id: input.relatedUserId.value } },
              },
              where: {
                userId_relatedUserId: {
                  relatedUserId: input.userId.value,
                  userId: input.relatedUserId.value,
                },
              },
            },
          ],
        },
      },
    })
  }
}
