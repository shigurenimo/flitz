import { Injectable } from "@nestjs/common"
import db from "db"
import { Count, Id, Skip } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { includeEmbededPost } from "integrations/infrastructure/utils/includeEmbededPost"
import { QueryNotification } from "integrations/interface/types/queryNotification"

@Injectable()
export class UserNotificationQuery {
  constructor(private queryConverter: QueryConverter) {}

  async count(userId: Id) {
    const count = await db.notification.count({
      where: { userId: userId.value },
    })

    return new Count(count)
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

  async findMany(userId: Id, skip: Skip): Promise<QueryNotification[]> {
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
      skip: skip.value,
      take: 16,
      where: { userId: userId.value },
    })

    return notifications.map((notification) => {
      return this.queryConverter.toUserNotification(notification)
    })
  }
}
