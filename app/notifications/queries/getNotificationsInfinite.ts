import { Ctx } from "blitz"
import db, { Prisma } from "db"

type Input = Pick<Prisma.FindManyPostArgs, "skip" | "take">

const getNotificationsInfinite = async ({ skip = 0, take }: Input, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = ctx.session.userId

  const notifications = await db.notification.findMany({
    include: {
      friendship: {
        include: {
          follower: true,
        },
      },
      like: {
        include: {
          post: {
            include: {
              likes: { where: { userId } },
              quotation: {
                include: {
                  likes: { where: { userId } },
                  quotations: { where: { userId } },
                  replies: { where: { userId } },
                  user: true,
                },
              },
              quotations: { where: { userId } },
              replies: { where: { userId } },
              reply: {
                include: {
                  likes: { where: { userId } },
                  quotations: { where: { userId } },
                  replies: { where: { userId } },
                  user: true,
                },
              },
              user: true,
            },
          },
          user: true,
        },
      },
      post: {
        include: {
          likes: { where: { userId } },
          quotation: {
            include: {
              likes: { where: { userId } },
              quotations: { where: { userId } },
              replies: { where: { userId } },
              user: true,
            },
          },
          quotations: { where: { userId } },
          replies: { where: { userId } },
          reply: {
            include: {
              likes: { where: { userId } },
              quotations: { where: { userId } },
              replies: { where: { userId } },
              user: true,
            },
          },
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
    where: { userId },
  })

  const unreadNotifications = notifications.filter((notification) => {
    return !notification.isRead
  })

  if (unreadNotifications.length > 0) {
    await db.notification.updateMany({
      data: { isRead: true },
      where: {
        userId,
        isRead: false,
      },
    })
  }

  const count = await db.notification.count({ where: { userId } })

  const hasMore = typeof take === "number" ? skip + take < count : false

  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { notifications, hasMore, nextPage }
}

export default getNotificationsInfinite
