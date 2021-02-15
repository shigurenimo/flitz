import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"
import { includeEmbededPost } from "integrations/infrastructure/utils"

export class UserNotificationQuery {
  async count(input: { userId: Id }) {
    const count = await db.notification.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  async hasUnread(input: { userId: Id }) {
    const notification = await db.notification.findFirst({
      where: {
        isRead: false,
        userId: input.userId.value,
      },
    })

    return notification !== null
  }

  async findMany(input: { skip: Skip; userId: Id }) {
    const notifications = await db.notification.findMany({
      include: {
        friendship: {
          include: { follower: { include: { iconImage: true } } },
        },
        like: {
          include: {
            post: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotation: { include: includeEmbededPost(input.userId) },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                reply: { include: includeEmbededPost(input.userId) },
                user: { include: { iconImage: true } },
              },
            },
            user: { include: { iconImage: true } },
          },
        },
        post: {
          include: {
            likes: { where: { userId: input.userId.value } },
            quotation: { include: includeEmbededPost(input.userId) },
            quotations: { where: { userId: input.userId.value } },
            replies: { where: { userId: input.userId.value } },
            reply: { include: includeEmbededPost(input.userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
    })

    return notifications
  }
}
