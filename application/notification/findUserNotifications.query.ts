import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"

import { toAppNotification } from "infrastructure/utils"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
  skip: number
}

@injectable()
export class FindUserNotificationsQuery {
  async execute(props: Props) {
    try {
      const notifications = await db.notification.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
        where: { userId: props.userId.value },
        include: {
          friendship: {
            include: { follower: { include: { iconImage: true } } },
          },
          like: {
            include: {
              post: {
                include: {
                  files: true,
                  likes: { where: { userId: props.userId.value } },
                  quotation: { include: includePostEmbedded(props.userId) },
                  quotations: { where: { userId: props.userId.value } },
                  replies: { where: { userId: props.userId.value } },
                  reply: { include: includePostEmbedded(props.userId) },
                },
              },
              user: { include: { iconImage: true } },
            },
          },
          post: {
            include: {
              files: true,
              likes: { where: { userId: props.userId.value } },
              quotation: { include: includePostEmbedded(props.userId) },
              quotations: { where: { userId: props.userId.value } },
              replies: { where: { userId: props.userId.value } },
              reply: { include: includePostEmbedded(props.userId) },
              user: { include: { iconImage: true } },
            },
          },
        },
      })

      const appNotifications = notifications.map((prismaNotification) => {
        return toAppNotification(prismaNotification)
      })

      return appNotifications
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
