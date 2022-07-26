import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { getMessaging } from "firebase-admin/messaging"
import { injectable } from "tsyringe"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { FirebaseAdapter, UserRepository } from "integrations/infrastructure"

type Props = {
  userId: Id
}

@injectable()
export class TestNotificationService {
  constructor(
    private userRepository: UserRepository,
    private firebaseAdapter: FirebaseAdapter
  ) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user instanceof Error) {
        return new InternalError()
      }

      if (user === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      if (user === null || user.fcmToken === null) {
        return new InternalError("FCMトークンが存在しないので送信できない")
      }

      this.firebaseAdapter.initialize()

      await getMessaging().sendToDevice(user.fcmToken, {
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
