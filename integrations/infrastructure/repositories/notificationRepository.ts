import db from "db"
import { INotificationRepository } from "integrations/domain/repositories"
import { Id } from "integrations/domain/valueObjects"

export class NotificationRepository implements INotificationRepository {
  async upsertQuotationNotification(input: {
    quotationId: Id
    postUserId: Id
    postId: Id
  }) {
    await db.notification.upsert({
      create: {
        post: { connect: { id: input.quotationId.value } },
        type: "QUOTATION",
        uniqueId: input.postId.value,
        user: { connect: { id: input.postUserId.value } },
      },
      update: {
        post: { connect: { id: input.quotationId.value } },
      },
      where: {
        userId_type_uniqueId: {
          type: "QUOTATION",
          uniqueId: input.postId.value,
          userId: input.postUserId.value,
        },
      },
    })

    // await db.$transaction([
    //   ...friendships.map((friendship) => {
    //     return db.reference.create({
    //       data: {
    //         post: { connect: { id: post.id } },
    //         user: { connect: { id: friendship.followeeId } },
    //       },
    //     })
    //   }),
    // ])

    return null
  }

  async upsertPostLikeNotification(input: {
    likeId: Id
    postId: Id
    postUserId: Id
    userId: Id
  }) {
    await db.notification.upsert({
      create: {
        like: { connect: { id: input.likeId.value } },
        type: "LIKE",
        uniqueId: input.postId.value,
        user: { connect: { id: input.postUserId.value } },
      },
      update: {
        like: { connect: { id: input.likeId.value } },
      },
      where: {
        userId_type_uniqueId: {
          type: "LIKE",
          uniqueId: input.postId.value,
          userId: input.postUserId.value,
        },
      },
    })

    return null
  }

  async upsertFollowNotification(input: {
    followeeId: Id
    followerId: Id
    friendshipId: Id
  }) {
    await db.notification.upsert({
      create: {
        friendship: { connect: { id: input.friendshipId.value } },
        type: "FRIENDSHIP",
        uniqueId: input.followerId.value,
        user: { connect: { id: input.followeeId.value } },
      },
      update: {
        friendship: { connect: { id: input.friendshipId.value } },
      },
      where: {
        userId_type_uniqueId: {
          type: "FRIENDSHIP",
          uniqueId: input.followerId.value,
          userId: input.followeeId.value,
        },
      },
    })

    return null
  }

  async createReplyNotification(input: { replyId: Id; postUserId: Id }) {
    await db.notification.create({
      data: {
        post: { connect: { id: input.replyId.value } },
        type: "REPLY",
        uniqueId: input.replyId.value,
        user: { connect: { id: input.postUserId.value } },
      },
    })

    return null
  }

  async markAsRead(input: { userId: Id }) {
    await db.notification.updateMany({
      data: { isRead: true },
      where: {
        userId: input.userId.value,
        isRead: false,
      },
    })

    return null
  }
}
