import { captureException } from "@sentry/node"
import { IdFactory, MessageEntity } from "core"
import db from "db"

export class MessageRepository {
  async upsert(message: MessageEntity) {
    try {
      await db.message.create({
        data: {
          id: message.id.value,
          text: message?.text.value,
          user: { connect: { id: message.userId.value } },
          threads: {
            connectOrCreate: [
              {
                create: {
                  id: IdFactory.nanoid().value,
                  isRead: true,
                  relatedUserId: message.relatedUserId.value,
                  userId: message.userId.value,
                },
                where: {
                  userId_relatedUserId: {
                    relatedUserId: message.relatedUserId.value,
                    userId: message.userId.value,
                  },
                },
              },
              {
                create: {
                  id: IdFactory.nanoid().value,
                  isRead: false,
                  relatedUserId: message.userId.value,
                  userId: message.relatedUserId.value,
                },
                where: {
                  userId_relatedUserId: {
                    relatedUserId: message.userId.value,
                    userId: message.relatedUserId.value,
                  },
                },
              },
            ],
          },
        },
      })

      return null
    } catch (error) {
      captureException(error, { level: "fatal" })

      if (error instanceof Error) {
        return new Error(error.message)
      }

      return new Error()
    }
  }
}
