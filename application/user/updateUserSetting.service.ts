import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import { UserRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  fcmTokenForMobile: string | null
  fcmToken: string | null
  userId: Id
}

@injectable()
export class UpdateUserSettingService {
  constructor(private userRepository: UserRepository) {}

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

      const draftUser = user.updateFcmToken(
        props.fcmToken,
        props.fcmTokenForMobile
      )

      const transaction = await this.userRepository.upsert(draftUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return user
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
