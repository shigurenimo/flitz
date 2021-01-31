import db from "db"
import { IMessageRepository } from "domain/repositories"
import { Count, Id, PostText, Skip } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"

export class MessageRepository implements IMessageRepository {
  async countUserGroupMessages(input: { exchangeId: Id }) {
    const count = await db.message.count({
      where: { id: input.exchangeId.value },
    })

    return new Count(count)
  }

  async countUserMessages(input: { relatedUserId: Id; userId: Id }) {
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

  async markMesagesAsRead(input: { relatedUserId: Id; userId: Id }) {
    await db.message.updateMany({
      data: { isRead: true },
      where: {
        exchanges: {
          // 相手のメッセージを既読にする
          some: {
            userId: input.relatedUserId.value,
            relatedUserId: input.userId.value,
            isRead: false,
          },
        },
      },
    })

    return null
  }

  async getUserExchangeMessages(input: {
    relatedUserId: Id
    skip: Skip
    userId: Id
  }) {
    const messages = await db.message.findMany({
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

    const messageEntities = messages.map((message) => {
      return new PrismaAdapter().toMessageEntity(message)
    })

    return { messages, messageEntities }
  }

  async createMessage(input: {
    text: PostText
    userId: Id
    relatedUserId: Id
  }) {
    await db.message.create({
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

    return null
  }
}
