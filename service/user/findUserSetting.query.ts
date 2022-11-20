import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core/valueObjects"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { AppSetting } from "infrastructure/models"

type Props = {
  userId: Id
}

@injectable()
export class FindUserSettingQuery {
  async execute(props: Props) {
    try {
      const user = await db.user.findUnique({
        where: { id: props.userId.value },
      })

      if (user === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      const appSetting: AppSetting = {
        fcmToken: user.fcmToken?.slice(0, 4) || null,
        fcmTokenForMobile: user.fcmTokenForMobile?.slice(0, 4) || null,
        isProtected: user.isProtected,
        isPublicEmail: user.isPublicEmail,
        isEnabledNotificationEmail: user.isEnabledNotificationEmail,
        isEnabledNotificationMessage: user.isEnabledNotificationMessage,
        isEnabledNotificationPostLike: user.isEnabledNotificationPostLike,
        isEnabledNotificationPostQuotation:
          user.isEnabledNotificationPostQuotation,
      }

      return appSetting
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
