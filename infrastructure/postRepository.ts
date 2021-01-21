import db, { Friendship } from "db"
import { Count, Id, PostText, Skip, Take, Username } from "domain/valueObjects"

/**
 * ## 投稿
 */
export class PostRepository {
  static async countReplies(input: { replyId: Id }) {
    const count = await db.post.count({
      where: { replyId: input.replyId.value },
    })

    return new Count(count)
  }

  static async countPosts() {
    const count = await db.post.count()

    return new Count(count)
  }

  static async countUserPosts(input: { username: Username }) {
    const count = await db.post.count({
      where: { user: { username: input.username.value } },
    })

    return new Count(count)
  }

  static async countUserReplies(input: { username: Username }) {
    const count = await db.post.count({
      where: {
        user: { username: input.username.value },
        replyId: { not: null },
      },
    })

    return new Count(count)
  }

  static createPost(input: {
    fileIds: Id[]
    friendships: Friendship[]
    text: PostText
    userId: Id
  }) {
    return db.post.create({
      data: {
        files: {
          connect: input.fileIds.map((id) => {
            return { id: id.value }
          }),
        },
        text: input.text.value,
        user: { connect: { id: input.userId.value } },
        references: {
          create: [
            {
              isRead: true,
              user: { connect: { id: input.userId.value } },
            },
            ...input.friendships.map((friendship) => {
              return {
                isRead: false,
                user: { connect: { id: friendship.followerId } },
              }
            }),
          ],
        },
      },
    })

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
  }

  static createReply(input: {
    friendships: Friendship[]
    postId: Id
    text: PostText
    userId: Id
  }) {
    return db.post.update({
      data: {
        replies: {
          create: {
            text: input.text.value,
            user: { connect: { id: input.userId.value } },
            references: {
              create: [
                {
                  isRead: true,
                  user: { connect: { id: input.userId.value } },
                },
                ...input.friendships.map((friendship) => {
                  return {
                    isRead: false,
                    user: { connect: { id: friendship.followerId } },
                  }
                }),
              ],
            },
          },
        },
        repliesCount: { increment: 1 },
      },
      include: {
        replies: {
          where: { userId: input.userId.value },
        },
      },
      where: { id: input.postId.value },
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
  }

  static createPostQuotation(input: {
    friendships: Friendship[]
    postId: Id
    userId: Id
  }) {
    return db.post.update({
      data: {
        quotations: {
          create: {
            user: { connect: { id: input.userId.value } },
            references: {
              create: [
                {
                  isRead: true,
                  user: { connect: { id: input.userId.value } },
                },
                ...input.friendships.map((friendship) => {
                  return {
                    isRead: false,
                    user: { connect: { id: friendship.followerId } },
                  }
                }),
              ],
            },
          },
        },
        quotationsCount: { increment: 1 },
      },
      include: {
        quotations: {
          where: { userId: input.userId.value },
        },
      },
      where: { id: input.postId.value },
    })
  }

  static deletePost(input: { postId: Id; userId: Id }) {
    return db.$transaction([
      db.post.delete({ where: { id: input.postId.value } }),
      db.bookmark.deleteMany({ where: { postId: input.postId.value } }),
      db.like.deleteMany({ where: { postId: input.postId.value } }),
      db.reference.deleteMany({ where: { postId: input.postId.value } }),
    ])
  }

  static createLikes(input: { postId: Id; userId: Id }) {
    return db.post.update({
      data: {
        likes: {
          create: {
            user: { connect: { id: input.userId.value } },
          },
        },
        likesCount: { increment: 1 },
      },
      where: { id: input.postId.value },
      include: {
        likes: { where: { userId: input.userId.value } },
        user: true,
      },
    })
  }

  static deleteLikes(input: { postId: Id; userId: Id }) {
    return db.post.update({
      data: {
        likes: {
          delete: {
            userId_postId: {
              userId: input.userId.value,
              postId: input.postId.value,
            },
          },
        },
        likesCount: { decrement: 1 },
      },
      where: { id: input.postId.value },
    })
  }

  static getReplies(input: {
    skip: Skip
    take: Take
    replyId: Id
    userId: Id | null
  }) {
    return db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { replyId: input.replyId.value },
    })
  }

  static getRepliesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    return db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: {
        user: { username: input.username.value },
        replyId: { not: null },
      },
    })
  }

  static getPostsByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    return db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })
  }

  static getNewPosts(input: { skip: Skip; userId: Id | null }) {
    return db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: {
          include: {
            files: true,
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: {
          include: {
            likes: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            quotations: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            replies: input.userId
              ? { where: { userId: input.userId.value } }
              : false,
            user: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
    })
  }

  static getPost(input: { id: Id }) {
    return db.post.findUnique({
      include: {
        files: true,
        user: true,
      },
      where: { id: input.id.value },
    })
  }
}
