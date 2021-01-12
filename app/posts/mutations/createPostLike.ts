import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = { postId: string }

const createPostLike = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.postId) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const updated = await db.post.update({
    data: {
      likes: {
        create: {
          user: { connect: { id: userId } },
        },
      },
      references: {
        update: {
          data: { hasLike: true },
          where: {
            userId_postId: {
              userId,
              postId: input.postId,
            },
          },
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

  const [like] = updated.likes

  const postUserId = updated.user.id

  await db.notification.upsert({
    create: {
      like: { connect: { id: like.id } },
      type: "LIKE",
      uniqueId: like.id,
      user: { connect: { id: postUserId } },
    },
    update: {},
    where: {
      userId_type_uniqueId: {
        type: "LIKE",
        uniqueId: like.id,
        userId: postUserId,
      },
    },
  })

  return updated
}

export default createPostLike
