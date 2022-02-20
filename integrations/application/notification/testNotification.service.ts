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
    private firebaseAdapterService: FirebaseAdapter
  ) {}

  async execute(props: Props) {
    try {
      const setting = await this.settingRepository.findByUserId(props.userId)

      if (setting === null) {
        throw new NotFoundError()
      }

      if (setting === null || setting.fcmToken === null) {
        throw new Error("")
      }

      this.firebaseAdapterService.initialize()

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
