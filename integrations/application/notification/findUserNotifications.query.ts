import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import {
  AppPostConverter,
  AppUserEmbeddedConverter,
} from "integrations/infrastructure/converters"
import { PrismaNotification } from "integrations/infrastructure/types/prismaNotification"
import { includePostEmbedded } from "integrations/infrastructure/utils/includePostEmbedded"
import { AppNotification } from "integrations/types"

type Props = {
  userId: Id
  skip: number
}

@injectable()
export class FindUserNotificationsQuery {
  constructor(
    private appPostConverter: AppPostConverter,
    private appUserEmbeddedConverter: AppUserEmbeddedConverter
  ) {}

  async execute(props: Props) {
    try {
      const prismaNotifications = await db.notification.findMany({
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

      const appNotifications = prismaNotifications.map((prismaNotification) => {
        return this.toAppNotification(prismaNotification)
      })

      return appNotifications
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }

  toAppNotification(
    prismaNotification: PrismaNotification
  ): AppNotification | null {
    // フォローの通知
    if (prismaNotification.friendship !== null) {
      return {
        id: prismaNotification.id,
        createdAt: prismaNotification.createdAt,
        type: "FOLLOW",
        isRead: prismaNotification.isRead,
        embedded: this.appUserEmbeddedConverter.fromPrisma(
          prismaNotification.friendship.follower
        ),
      }
    }

    // ライクの通知
    if (prismaNotification.like !== null) {
      return {
        id: prismaNotification.id,
        createdAt: prismaNotification.createdAt,
        type: "LIKE",
        isRead: prismaNotification.isRead,
        embedded: {
          id: prismaNotification.like.post.id,
          createdAt: prismaNotification.like.post.createdAt,
          text: prismaNotification.like.post.text || null,
          user: this.appUserEmbeddedConverter.fromPrisma(
            prismaNotification.like.user
          ),
        },
      }
    }

    // リプライの通知
    if (prismaNotification.post !== null) {
      return {
        id: prismaNotification.id,
        createdAt: prismaNotification.createdAt,
        type: "POST",
        isRead: prismaNotification.isRead,
        embedded: this.appPostConverter.fromPrisma(prismaNotification.post),
      }
    }

    return null
  }
}
