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
      },
      quotationsCount: { increment: 1 },
    },
    include: {
      quotations: {
        where: { userId },
      },
    },
    where: { id: input.postId },
  })

  const [quotation] = post.quotations

  await db.notification.upsert({
    create: {
      post: { connect: { id: quotation.id } },
      type: "QUOTATION",
      uniqueId: input.postId,
      user: { connect: { id: post.userId } },
    },
    update: {
      post: { connect: { id: quotation.id } },
    },
    where: {
      userId_type_uniqueId: {
        type: "QUOTATION",
        uniqueId: input.postId,
        userId: post.userId,
      },
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
