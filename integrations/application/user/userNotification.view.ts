import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { injectable } from "tsyringe"

@injectable()
export class UserNotificationQuery {
  constructor(private queryConverter: ViewConverter) {}

  async count(userId: Id) {
    const count = await db.notification.count({
      where: { userId: userId.value },
    })

    return count
  }

  async hasUnread(userId: Id) {
    const notification = await db.notification.findFirst({
      where: {
        isRead: false,
        userId: userId.value,
      },
    })

    return notification !== null
  }

  async findMany(userId: Id, skip: number) {
    const notifications = await db.notification.findMany({
      include: {
        friendship: {
          include: { follower: { include: { iconImage: true } } },
        },
        like: {
          include: {
            post: {
              include: {
                files: true,
                likes: { where: { userId: userId.value } },
                quotation: { include: includeEmbededPost(userId) },
                quotations: { where: { userId: userId.value } },
                replies: { where: { userId: userId.value } },
                reply: { include: includeEmbededPost(userId) },
              },
            },
            user: { include: { iconImage: true } },
          },
        },
        post: {
          include: {
            files: true,
            likes: { where: { userId: userId.value } },
            quotation: { include: includeEmbededPost(userId) },
            quotations: { where: { userId: userId.value } },
            replies: { where: { userId: userId.value } },
            reply: { include: includeEmbededPost(userId) },
            user: { include: { iconImage: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: 16,
      where: { userId: userId.value },
    })

    return notifications.map((notification) => {
      return this.queryConverter.toUserNotification(notification)
    })
  }
}
