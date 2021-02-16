import db from "db"
import { IMessageRepository } from "integrations/domain/repositories"
import { Id, PostText } from "integrations/domain/valueObjects"

export class MessageRepository implements IMessageRepository {
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
