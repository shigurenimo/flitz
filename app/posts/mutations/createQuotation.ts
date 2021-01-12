import { Ctx, NotFoundError } from "blitz"
import db from "db"

type Input = {
  postId?: string
}

const createQuotation = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.postId) {
    throw new NotFoundError()
  }

  const userId = ctx.session.userId

  const friendships = await db.friendship.findMany({
    where: { followeeId: userId },
    take: 20000,
  })

  const post = await db.post.update({
    data: {
      quotations: {
        create: {
          user: { connect: { id: userId } },
          references: {
            create: [
              {
                user: { connect: { id: userId } },
              },
              ...friendships.map((friendship) => {
                return {
                  user: { connect: { id: friendship.followerId } },
                }
              }),
            ],
          },
        },
      },
      quotationsCount: { increment: 1 },
      references: {
        update: {
          data: { hasQuotation: true },
          where: {
            userId_postId: {
              userId,
              postId: input.postId,
            },
          },
        },
      },
    },
    include: {
      quotations: {
        where: { userId },
      },
    },
    where: { id: input.postId },
  })

  const [quotation] = post.quotations

  await db.notification.create({
    data: {
      post: { connect: { id: quotation.id } },
      type: "QUOTATION",
      uniqueId: quotation.id,
      user: { connect: { id: post.userId } },
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

  return post
}

export default createQuotation
