import db from "db"
import { Id, PostEntity, PostText } from "integrations/domain"

export class PostRepository {
  async find(id: Id) {
    const post = await db.post.findUnique({
      where: { id: id.value },
      include: { files: true },
    })

    if (post === null) {
      return null
    }

    return new PostEntity({
      id: new Id(post.id),
      quotationId: post.quotationId ? new Id(post.quotationId) : null,
      quotationsCount: post.quotationsCount,
      repliesCount: post.repliesCount,
      replyId: post.replyId ? new Id(post.replyId) : null,
      text: post.text ? new PostText(post.text) : null,
      userId: new Id(post.userId),
      fileIds: post.files.map((file) => new Id(file.id)),
      followerIds: [],
    })
  }

  async upsert(post: PostEntity) {
    if (post.replyId !== null) {
      await db.post.update({
        data: {
          replies: {
            create: {
              id: post.id.value,
              text: post.text?.value || null,
              userId: post.userId.value,
              references: {
                create: [
                  {
                    isRead: true,
                    userId: post.userId.value,
                  },
                  ...post.followerIds.map((followerId) => {
                    return {
                      isRead: false,
                      userId: followerId.value,
                    }
                  }),
                ],
              },
            },
          },
          repliesCount: { increment: 1 },
        },
        include: { replies: { where: { userId: post.userId.value } } },
        where: { id: post.replyId.value },
      })
    }

    if (post.quotationId !== null) {
      await db.post.update({
        data: {
          quotations: {
            create: {
              id: post.id.value,
              userId: post.userId.value,
              references: {
                create: [
                  {
                    isRead: true,
                    userId: post.userId.value,
                  },
                  ...post.followerIds.map((followerId) => {
                    return {
                      isRead: false,
                      userId: followerId.value,
                    }
                  }),
                ],
              },
            },
          },
          quotationsCount: { increment: 1 },
        },
        include: { quotations: { where: { userId: post.userId.value } } },
        where: { id: post.quotationId.value },
      })
    }

    if (post.replyId === null && post.quotationId === null) {
      await db.post.create({
        data: {
          id: post.id.value,
          files: {
            connect: post.fileIds.map((id) => {
              return { id: id.value }
            }),
          },
          text: post.text?.value,
          userId: post.userId.value,
          references: {
            create: [
              {
                isRead: true,
                userId: post.userId.value,
              },
              ...post.followerIds.map((followerId) => {
                return {
                  isRead: false,
                  userId: followerId.value,
                }
              }),
            ],
          },
        },
      })
    }

    // await db.$transaction([
    //   ...friendships.map((friendship) => {
    //     return db.reference.create({
    //       data: {
    //         post: { connect: { id: post.id } },
    //         user: { connect: { id: friendship.followerId } },
    //       },
    //     })
    //   }),
    // ])

    return null
  }

  async upsertReply(post: PostEntity) {
    if (post.replyId === null) {
      return null
    }

    await db.post.update({
      data: {
        replies: {
          create: {
            id: post.id.value,
            text: post.text?.value,
            userId: post.userId.value,
            references: {
              create: [
                {
                  isRead: true,
                  userId: post.userId.value,
                },
                ...post.followerIds.map((followerId) => {
                  return {
                    isRead: false,
                    userId: followerId.value,
                  }
                }),
              ],
            },
          },
        },
        repliesCount: { increment: 1 },
      },
      include: { replies: { where: { userId: post.userId.value } } },
      where: { id: post.replyId.value },
    })

    // await db.$transaction([
    //   ...friendships.map((friendship) => {
    //     return db.reference.create({
    //       data: {
    //         post: { connect: { id: reply.id } },
    //         user: { connect: { id: friendship.followerId } },
    //       },
    //     })
    //   }),
    // ])

    return null
  }

  async upsertQuotation(post: PostEntity) {
    if (post.quotationId === null) {
      return null
    }

    await db.post.update({
      data: {
        quotations: {
          create: {
            id: post.id.value,
            userId: post.userId.value,
            references: {
              create: [
                {
                  isRead: true,
                  userId: post.userId.value,
                },
                ...post.followerIds.map((followerId) => {
                  return {
                    isRead: false,
                    userId: followerId.value,
                  }
                }),
              ],
            },
          },
        },
        quotationsCount: { increment: 1 },
      },
      include: { quotations: { where: { userId: post.userId.value } } },
      where: { id: post.quotationId.value },
    })

    return null
  }

  async delete(post: PostEntity) {
    await db.$transaction([
      db.post.delete({ where: { id: post.id.value } }),
      db.bookmark.deleteMany({ where: { postId: post.id.value } }),
      db.like.deleteMany({ where: { postId: post.id.value } }),
      db.reference.deleteMany({ where: { postId: post.id.value } }),
    ])

    return null
  }
}
