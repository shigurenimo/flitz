import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "integrations/errors"
import { AppSetting } from "integrations/types"

type Props = {
  userId: Id
}

@injectable()
export class FindUserSettingQuery {
  async execute(props: Props) {
    try {
      const prismaUser = await db.user.findUnique({
        where: { id: props.userId.value },
      })

      if (prismaUser === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      const appSetting: AppSetting = {
        fcmToken: prismaUser.fcmToken?.slice(0, 4) || null,
        fcmTokenForMobile: prismaUser.fcmTokenForMobile?.slice(0, 4) || null,
        isProtected: prismaUser.isProtected,
        isPublicEmail: prismaUser.isPublicEmail,
        isEnabledNotificationEmail: prismaUser.isEnabledNotificationEmail,
        isEnabledNotificationMessage: prismaUser.isEnabledNotificationMessage,
        isEnabledNotificationPostLike: prismaUser.isEnabledNotificationPostLike,
        isEnabledNotificationPostQuotation:
          prismaUser.isEnabledNotificationPostQuotation,
      }

      return appSetting
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
