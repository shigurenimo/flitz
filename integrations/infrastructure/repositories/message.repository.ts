import db from "db"
import { IdFactory, MessageEntity } from "integrations/domain"

export class MessageRepository {
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
                id: IdFactory.nanoid().value,
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
                id: IdFactory.nanoid().value,
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
