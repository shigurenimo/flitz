import { Count, Skip } from "app/domain/valueObjects"
import { Id } from "app/domain/valueObjects/id"
import db from "db"

export class NotificationRepository {
  static async countNotifications(input: { userId: Id }) {
    const count = await db.notification.count({
      where: { userId: input.userId.value },
    })

    return new Count(count)
  }

  static async hasUnreadNotifications(input: { userId: Id }) {
    const notification = await db.notification.findFirst({
      where: {
        isRead: false,
        userId: input.userId.value,
      },
    })

    return notification !== null
  }

  static async findNotifications(input: { skip: Skip; userId: Id }) {
    return db.notification.findMany({
      include: {
        friendship: {
          include: {
            follower: true,
          },
        },
        like: {
          include: {
            post: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotation: {
                  include: {
                    likes: { where: { userId: input.userId.value } },
                    quotations: { where: { userId: input.userId.value } },
                    replies: { where: { userId: input.userId.value } },
                    user: true,
                  },
                },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                reply: {
                  include: {
                    likes: { where: { userId: input.userId.value } },
                    quotations: { where: { userId: input.userId.value } },
                    replies: { where: { userId: input.userId.value } },
                    user: true,
                  },
                },
                user: true,
              },
            },
            user: true,
          },
        },
        post: {
          include: {
            likes: { where: { userId: input.userId.value } },
            quotation: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                user: true,
              },
            },
            quotations: { where: { userId: input.userId.value } },
            replies: { where: { userId: input.userId.value } },
            reply: {
              include: {
                likes: { where: { userId: input.userId.value } },
                quotations: { where: { userId: input.userId.value } },
                replies: { where: { userId: input.userId.value } },
                user: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
      where: { userId: input.userId.value },
    })
  }

  static async upsertQuotationNotification(input: {
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
  }

  static async upsertPostLikeNotification(input: {
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
  }

  static async upsertFollowNotification(input: {
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
  }

  static async createReplyNotification(input: { replyId: Id; postUserId: Id }) {
    await db.notification.create({
      data: {
        post: { connect: { id: input.replyId.value } },
        type: "REPLY",
        uniqueId: input.replyId.value,
        user: { connect: { id: input.postUserId.value } },
      },
    })
  }

  static markNotificationsAsRead(input: { userId: Id }) {
    return db.notification.updateMany({
      data: { isRead: true },
      where: {
        userId: input.userId.value,
        isRead: false,
      },
    })
  }
}
