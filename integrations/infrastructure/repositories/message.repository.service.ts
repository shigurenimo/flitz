import db from "db"
import { Id, IdFactory, MessageEntity } from "integrations/domain"
import { MessageRepository } from "integrations/domain/repositories"

export class MessageRepositoryService implements MessageRepository {
  async markAsRead(userId: Id, relatedUserId: Id) {
    await db.message.updateMany({
      data: { isRead: true },
      where: {
        exchanges: {
          some: {
            userId: relatedUserId.value,
            relatedUserId: userId.value,
            isRead: false,
          },
        },
      },
    })

    return null
  }

  async upsert(messageEntity: MessageEntity) {
    await db.message.create({
      data: {
        id: messageEntity.id.value,
        text: messageEntity?.text.value,
        user: { connect: { id: messageEntity.userId.value } },
        exchanges: {
          connectOrCreate: [
            {
              create: {
                id: IdFactory.create().value,
                isRead: true,
                relatedUserId: messageEntity.relatedUserId.value,
                userId: messageEntity.userId.value,
              },
              where: {
                userId_relatedUserId: {
                  relatedUserId: messageEntity.relatedUserId.value,
                  userId: messageEntity.userId.value,
                },
              },
            },
            {
              create: {
                id: IdFactory.create().value,
                isRead: false,
                relatedUserId: messageEntity.userId.value,
                userId: messageEntity.relatedUserId.value,
              },
              where: {
                userId_relatedUserId: {
                  relatedUserId: messageEntity.userId.value,
                  userId: messageEntity.relatedUserId.value,
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
