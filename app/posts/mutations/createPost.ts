import { Ctx } from "blitz"
import db from "db"

type CreatePostInput = { text: string }

const createPost = async (input: CreatePostInput, ctx: Ctx) => {
  ctx.session.authorize()

  if (input.text.trim().length === 0) {
    throw new Error("text.trim().length === 0")
  }

  const userId = ctx.session.userId

  const friendships = await db.friendship.findMany({
    where: { followeeId: userId },
    take: 20000,
  })

  const post = await db.post.create({
    data: {
      text: input.text,
      user: { connect: { id: userId } },
      references: {
        create: [
          {
            isRead: true,
            user: { connect: { id: userId } },
          },
          ...friendships.map((friendship) => {
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

  return post
}

export default createPost
