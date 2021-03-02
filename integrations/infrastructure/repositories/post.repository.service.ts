import db from "db"
import { Count, Id, PostEntity, PostText } from "integrations/domain"
import { PostRepository } from "integrations/domain/repositories"

export class PostRepositoryService implements PostRepository {
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
      quotationsCount: new Count(post.quotationsCount),
      repliesCount: new Count(post.repliesCount),
      replyId: post.replyId ? new Id(post.replyId) : null,
      text: post.text ? new PostText(post.text) : null,
      userId: new Id(post.userId),
      fileIds: post.files.map((file) => new Id(file.id)),
      followerIds: [],
    })
  }

  async upsert(postEntity: PostEntity) {
    if (postEntity.replyId !== null) {
      await db.post.update({
        data: {
          replies: {
            create: {
              id: postEntity.id.value,
              text: postEntity.text?.value || null,
              userId: postEntity.userId.value,
              references: {
                create: [
                  {
                    isRead: true,
                    userId: postEntity.userId.value,
                  },
                  ...postEntity.followerIds.map((followerId) => {
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
        include: { replies: { where: { userId: postEntity.userId.value } } },
        where: { id: postEntity.replyId.value },
      })
    }

    if (postEntity.quotationId !== null) {
      await db.post.update({
        data: {
          quotations: {
            create: {
              id: postEntity.id.value,
              userId: postEntity.userId.value,
              references: {
                create: [
                  {
                    isRead: true,
                    userId: postEntity.userId.value,
                  },
                  ...postEntity.followerIds.map((followerId) => {
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
        include: { quotations: { where: { userId: postEntity.userId.value } } },
        where: { id: postEntity.quotationId.value },
      })
    }

    if (postEntity.replyId === null && postEntity.quotationId === null) {
      await db.post.create({
        data: {
          id: postEntity.id.value,
          files: {
            connect: postEntity.fileIds.map((id) => {
              return { id: id.value }
            }),
          },
          text: postEntity.text?.value,
          userId: postEntity.userId.value,
          references: {
            create: [
              {
                isRead: true,
                userId: postEntity.userId.value,
              },
              ...postEntity.followerIds.map((followerId) => {
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

  async upsertReply(postEntity: PostEntity) {
    if (postEntity.replyId === null) {
      return null
    }

    await db.post.update({
      data: {
        replies: {
          create: {
            id: postEntity.id.value,
            text: postEntity.text?.value,
            userId: postEntity.userId.value,
            references: {
              create: [
                {
                  isRead: true,
                  userId: postEntity.userId.value,
                },
                ...postEntity.followerIds.map((followerId) => {
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
      include: { replies: { where: { userId: postEntity.userId.value } } },
      where: { id: postEntity.replyId.value },
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

  async upsertQuotation(postEntity: PostEntity) {
    if (postEntity.quotationId === null) {
      return null
    }

    await db.post.update({
      data: {
        quotations: {
          create: {
            id: postEntity.id.value,
            userId: postEntity.userId.value,
            references: {
              create: [
                {
                  isRead: true,
                  userId: postEntity.userId.value,
                },
                ...postEntity.followerIds.map((followerId) => {
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
      include: { quotations: { where: { userId: postEntity.userId.value } } },
      where: { id: postEntity.quotationId.value },
    })

    return null
  }

  async delete(postEntity: PostEntity) {
    await db.$transaction([
      db.post.delete({ where: { id: postEntity.id.value } }),
      db.bookmark.deleteMany({ where: { postId: postEntity.id.value } }),
      db.like.deleteMany({ where: { postId: postEntity.id.value } }),
      db.reference.deleteMany({ where: { postId: postEntity.id.value } }),
    ])

    return null
  }
}
