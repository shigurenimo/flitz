import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import admin from "firebase-admin"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { FirebaseAdapter, SettingRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class TestNotificationService {
  constructor(
    private settingRepository: SettingRepository,
    private firebaseAdapter: FirebaseAdapter
  ) {}

  async execute(props: Props) {
    try {
      const setting = await this.settingRepository.findByUserId(props.userId)

      if (setting instanceof Error) {
        return new InternalError()
      }

      if (setting === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      if (setting === null || setting.fcmToken === null) {
        return new InternalError("FCMトークンが存在しないので送信できない")
      }

      this.firebaseAdapter.initialize()

      await admin.messaging().sendToDevice(setting.fcmToken, {
        notification: {
          title: "TEST Notification",
          body: "This is a test Notification.",
        },
      })

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
