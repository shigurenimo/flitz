import { Ctx } from "blitz"
import db from "db"

type CreatePostInput = {
  data: {
    text: string
  }
}

const createPost = async ({ data }: CreatePostInput, ctx: Ctx) => {
  ctx.session.authorize()

  if (data.text.trim().length === 0) {
    throw new Error("text.trim().length === 0")
  }

  const friendships = await db.friendship.findMany({
    where: { followeeId: ctx.session.userId },
    take: 20000,
  })

  const post = await db.post.create({
    data: {
      text: data.text,
      user: { connect: { id: ctx.session.userId } },
      references: {
        create: [
          {
            isRead: true,
            user: { connect: { id: ctx.session.userId } },
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
