import db from "db"
import { NotificationEntity } from "integrations/domain"

export class NotificationRepository {
  async upsert(notification: NotificationEntity) {
    if (notification.type.value === "QUOTATION") {
      return this.upsertQuotationNotification(notification)
    }

    if (notification.type.value === "FRIENDSHIP") {
      return this.upsertFollowNotification(notification)
    }

    if (notification.type.value === "LIKE") {
      return this.upsertPostLikeNotification(notification)
    }

    if (notification.type.value === "REPLY") {
      return this.createReplyNotification(notification)
    }

    return null
  }

  private async upsertQuotationNotification(notification: NotificationEntity) {
    if (
      notification.userId === null ||
      notification.postId === null ||
      notification.relatedUserId === null
    ) {
      return null
    }

    // userId + postId + senderId
    const uniqueId =
      notification.postId.value + notification.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notification.id.value,
        postId: notification.postId.value,
        type: "QUOTATION",
        uniqueId,
        userId: notification.userId.value,
      },
      update: {
        postId: notification.postId.value,
      },
      where: {
        userId_type_uniqueId: {
          type: "QUOTATION",
          uniqueId,
          userId: notification.userId.value,
        },
      },
    })

    return null
  }

  private async upsertPostLikeNotification(notification: NotificationEntity) {
    if (
      notification.userId === null ||
      notification.likeId === null ||
      notification.postId === null ||
      notification.relatedUserId === null
    ) {
      return null
    }

    // userId + postId + senderId
    const uniqueId =
      notification.postId.value + notification.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notification.id.value,
        likeId: notification.likeId.value,
        type: "LIKE",
        uniqueId,
        userId: notification.userId.value,
      },
      update: {
        likeId: notification.likeId.value,
      },
      where: {
        userId_type_uniqueId: {
          type: "LIKE",
          uniqueId,
          userId: notification.userId.value,
        },
      },
    })

    return null
  }

  private async upsertFollowNotification(notification: NotificationEntity) {
    if (
      notification.userId === null ||
      notification.friendshipId === null ||
      notification.relatedUserId === null
    ) {
      return null
    }

    // userId + senderId
    const uniqueId = notification.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notification.id.value,
        friendshipId: notification.friendshipId.value,
        type: "FRIENDSHIP",
        uniqueId,
        userId: notification.userId.value,
      },
      update: {
        friendship: { connect: { id: notification.friendshipId.value } },
      },
      where: {
        userId_type_uniqueId: {
          type: "FRIENDSHIP",
          uniqueId,
          userId: notification.userId.value,
        },
      },
    })

    return null
  }

  private async createReplyNotification(notification: NotificationEntity) {
    if (notification.userId === null || notification.postId === null) {
      return null
    }

    // userId + postId
    const uniqueId = notification.postId.value

    await db.notification.create({
      data: {
        id: notification.id.value,
        post: { connect: { id: notification.postId.value } },
        type: "REPLY",
        uniqueId,
        user: { connect: { id: notification.userId.value } },
      },
    })

    return null
  }
}
