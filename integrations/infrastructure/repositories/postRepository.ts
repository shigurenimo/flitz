import db, { Friendship } from "db"
import { IPostRepository } from "integrations/domain/repositories"
import { Count, Id, PostText, Skip, Take, Username } from "integrations/domain/valueObjects"
import { PrismaAdapter } from "integrations/infrastructure/adapters"
import { includeReplyPost } from "integrations/infrastructure/repositories/utils"

export class PostRepository implements IPostRepository {
  prismaAdapter: PrismaAdapter

  constructor() {
    this.prismaAdapter = new PrismaAdapter()
  }

  async countReplies(input: { replyId: Id }) {
    const count = await db.post.count({
      where: { replyId: input.replyId.value },
    })

    return new Count(count)
  }

  async countPosts() {
    const count = await db.post.count()

    return new Count(count)
  }

  async countUserPosts(input: { username: Username }) {
    const count = await db.post.count({
      where: { user: { username: input.username.value } },
    })

    return new Count(count)
  }

  async countUserReplies(input: { username: Username }) {
    const count = await db.post.count({
      where: {
        user: { username: input.username.value },
        replyId: { not: null },
      },
    })

    return new Count(count)
  }

  async createPost(input: {
    fileIds: Id[]
    friendships: Friendship[]
    text: PostText
    userId: Id
  }) {
    const post = await db.post.create({
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

    const postEntity = new PrismaAdapter().toPostEntity(post)

    return { post, postEntity }
  }

  async createReply(input: {
    friendships: Friendship[]
    postId: Id
    text: PostText
    userId: Id
  }) {
    const post = await db.post.update({
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
      include: { replies: { where: { userId: input.userId.value } } },
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

    const postEntity = new PrismaAdapter().toPostEntity(post)

    return { post, postEntity }
  }

  async createPostQuotation(input: {
    friendships: Friendship[]
    postId: Id
    userId: Id
  }) {
    const post = await db.post.update({
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
      include: { quotations: { where: { userId: input.userId.value } } },
      where: { id: input.postId.value },
    })

    const postEntity = this.prismaAdapter.toPostEntity(post)

    return { post, postEntity }
  }

  async deletePost(input: { postId: Id; userId: Id }) {
    await db.$transaction([
      db.post.delete({ where: { id: input.postId.value } }),
      db.bookmark.deleteMany({ where: { postId: input.postId.value } }),
      db.like.deleteMany({ where: { postId: input.postId.value } }),
      db.reference.deleteMany({ where: { postId: input.postId.value } }),
    ])

    return null
  }

  async createLikes(input: { postId: Id; userId: Id }) {
    const post = await db.post.update({
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
        user: { include: { iconImage: true } },
      },
    })

    const postEntity = new PrismaAdapter().toPostEntity(post)

    return { post, postEntity }
  }

  async deleteLikes(input: { postId: Id; userId: Id }) {
    await db.post.update({
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

    return null
  }

  async getReplies(input: {
    skip: Skip
    take: Take
    replyId: Id
    userId: Id | null
  }) {
    const posts = await db.post.findMany({
      include: includeReplyPost(input.userId),
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { replyId: input.replyId.value },
    })

    const postEntities = posts.map((post) => {
      return new PrismaAdapter().toPostEntity(post)
    })

    return { posts, postEntities }
  }

  async getRepliesByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    const posts = await db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: { include: includeReplyPost(input.userId) },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: { include: includeReplyPost(input.userId) },
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: {
        user: { username: input.username.value },
        replyId: { not: null },
      },
    })

    const postEntities = posts.map((post) => {
      return new PrismaAdapter().toPostEntity(post)
    })

    return { posts, postEntities }
  }

  async getPostsByUsername(input: {
    skip: Skip
    take: Take
    userId: Id | null
    username: Username
  }) {
    const posts = await db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: { include: includeReplyPost(input.userId) },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: { include: includeReplyPost(input.userId) },
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: input.take.value,
      where: { user: { username: input.username.value } },
    })

    const postEntities = posts.map((post) => {
      return new PrismaAdapter().toPostEntity(post)
    })

    return { posts, postEntities }
  }

  async getNewPosts(input: { skip: Skip; userId: Id | null }) {
    const posts = await db.post.findMany({
      include: {
        files: true,
        likes: input.userId ? { where: { userId: input.userId.value } } : false,
        quotation: { include: includeReplyPost(input.userId) },
        quotations: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        replies: input.userId
          ? { where: { userId: input.userId.value } }
          : false,
        reply: { include: includeReplyPost(input.userId) },
        user: { include: { iconImage: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: input.skip.value,
      take: 16,
    })

    const postEntities = posts.map((post) => {
      return new PrismaAdapter().toPostEntity(post)
    })

    return { posts, postEntities }
  }

  async getPost(input: { id: Id }) {
    const post = await db.post.findUnique({
      include: {
        files: true,
        user: { include: { iconImage: true } },
      },
      where: { id: input.id.value },
    })

    const postEntity = new PrismaAdapter().toPostEntity(post)

    return { post, postEntity }
  }
}
