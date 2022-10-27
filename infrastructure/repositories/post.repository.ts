import { captureException } from "@sentry/node"
import { Id, PostEntity, PostText } from "core"
import db from "db"

export class PostRepository {
  async find(id: Id) {
    try {
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
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  async upsert(post: PostEntity) {
    try {
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
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  async upsertReply(post: PostEntity) {
    try {
      if (post.replyId === null) {
        return new Error("リプライ先が存在しない。")
      }

      await db.post.update({
        include: { replies: { where: { userId: post.userId.value } } },
        where: { id: post.replyId.value },
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
    } catch (error) {
      captureException(error, { level: "fatal" })
      if (error instanceof Error) {
        return new Error(error.message)
      }
      return new Error()
    }
  }

  async upsertQuotation(post: PostEntity) {
    try {
      if (post.quotationId === null) {
        return new Error()
      }

      await db.post.update({
        where: { id: post.quotationId.value },
        include: { quotations: { where: { userId: post.userId.value } } },
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

  async delete(post: PostEntity) {
    try {
      await db.$transaction([
        db.post.delete({ where: { id: post.id.value } }),
        db.bookmark.deleteMany({ where: { postId: post.id.value } }),
        db.like.deleteMany({ where: { postId: post.id.value } }),
        db.reference.deleteMany({ where: { postId: post.id.value } }),
      ])

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
