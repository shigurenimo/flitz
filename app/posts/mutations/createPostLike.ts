import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { postId: string }

const createPostLike = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.postId) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const post = await db.post.update({
    data: {
      likes: {
        create: {
          user: { connect: { id: userId } },
        },
      },
      likesCount: { increment: 1 },
    },
    where: { id: input.postId },
    include: {
      likes: { where: { userId } },
      user: true,
    },
  })

  const [like] = post.likes

  await db.notification.upsert({
    create: {
      like: { connect: { id: like.id } },
      type: "LIKE",
      uniqueId: input.postId,
      user: { connect: { id: post.userId } },
    },
    update: {
      like: { connect: { id: like.id } },
    },
    where: {
      userId_type_uniqueId: {
        type: "LIKE",
        uniqueId: input.postId,
        userId: post.userId,
      },
    },
  })

  return post
}

export default createPostLike
