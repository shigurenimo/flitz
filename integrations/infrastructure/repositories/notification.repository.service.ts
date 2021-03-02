import db from "db"
import { Id, NotificationEntity } from "integrations/domain"
import { NotificationRepository } from "integrations/domain/repositories"

export class NotificationRepositoryService implements NotificationRepository {
  async upsert(notificationEntity: NotificationEntity) {
    if (notificationEntity.type.value === "QUOTATION") {
      return this.upsertQuotationNotification(notificationEntity)
    }

    if (notificationEntity.type.value === "FRIENDSHIP") {
      return this.upsertFollowNotification(notificationEntity)
    }

    if (notificationEntity.type.value === "LIKE") {
      return this.upsertPostLikeNotification(notificationEntity)
    }

    if (notificationEntity.type.value === "REPLY") {
      return this.createReplyNotification(notificationEntity)
    }

    return null
  }

  private async upsertQuotationNotification(
    notificationEntity: NotificationEntity
  ) {
    if (
      notificationEntity.userId === null ||
      notificationEntity.postId === null ||
      notificationEntity.relatedUserId === null
    ) {
      return null
    }

    // userId + postId + senderId
    const uniqueId =
      notificationEntity.postId.value + notificationEntity.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notificationEntity.id.value,
        postId: notificationEntity.postId.value,
        type: "QUOTATION",
        uniqueId,
        userId: notificationEntity.userId.value,
      },
      update: {
        postId: notificationEntity.postId.value,
      },
      where: {
        userId_type_uniqueId: {
          type: "QUOTATION",
          uniqueId,
          userId: notificationEntity.userId.value,
        },
      },
    })

    return null
  }

  private async upsertPostLikeNotification(
    notificationEntity: NotificationEntity
  ) {
    if (
      notificationEntity.userId === null ||
      notificationEntity.likeId === null ||
      notificationEntity.postId === null ||
      notificationEntity.relatedUserId === null
    ) {
      return null
    }

    // userId + postId + senderId
    const uniqueId =
      notificationEntity.postId.value + notificationEntity.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notificationEntity.id.value,
        likeId: notificationEntity.likeId.value,
        type: "LIKE",
        uniqueId,
        userId: notificationEntity.userId.value,
      },
      update: {
        likeId: notificationEntity.likeId.value,
      },
      where: {
        userId_type_uniqueId: {
          type: "LIKE",
          uniqueId,
          userId: notificationEntity.userId.value,
        },
      },
    })

    return null
  }

  private async upsertFollowNotification(
    notificationEntity: NotificationEntity
  ) {
    if (
      notificationEntity.userId === null ||
      notificationEntity.friendshipId === null ||
      notificationEntity.relatedUserId === null
    ) {
      return null
    }

    // userId + senderId
    const uniqueId = notificationEntity.relatedUserId.value

    await db.notification.upsert({
      create: {
        id: notificationEntity.id.value,
        friendshipId: notificationEntity.friendshipId.value,
        type: "FRIENDSHIP",
        uniqueId,
        userId: notificationEntity.userId.value,
      },
      update: {
        friendship: { connect: { id: notificationEntity.friendshipId.value } },
      },
      where: {
        userId_type_uniqueId: {
          type: "FRIENDSHIP",
          uniqueId,
          userId: notificationEntity.userId.value,
        },
      },
    })

    return null
  }

  private async createReplyNotification(
    notificationEntity: NotificationEntity
  ) {
    if (
      notificationEntity.userId === null ||
      notificationEntity.postId === null
    ) {
      return null
    }

    // userId + postId
    const uniqueId = notificationEntity.postId.value

    await db.notification.create({
      data: {
        id: notificationEntity.id.value,
        post: { connect: { id: notificationEntity.postId.value } },
        type: "REPLY",
        uniqueId,
        user: { connect: { id: notificationEntity.userId.value } },
      },
    })

    return null
  }

  async markAsRead(userId: Id) {
    if (userId === null) {
      return null
    }

    await db.notification.updateMany({
      data: { isRead: true },
      where: {
        userId: userId.value,
        isRead: false,
      },
    })

    return null
  }
}
