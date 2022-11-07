import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import {
  Email,
  HashedPasswordFactory,
  IdFactory,
  Password,
  ShortText,
  UserEntity,
  UsernameFactory,
} from "core"
import { UserRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  password: Password
  email: Email
}

@injectable()
export class SignUpService {
  constructor(private userRepository: UserRepository) {}

  /**
   * ユーザーを作成する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const hashedPassword = await HashedPasswordFactory.fromPassword(
        props.password
      )

      const userId = IdFactory.nanoid()

      const user = new UserEntity({
        biography: new ShortText(""),
        hashedPassword,
        headerImageId: null,
        iconImageId: null,
        id: userId,
        name: null,
        username: UsernameFactory.random(),
        email: props.email,
        fcmToken: null,
        fcmTokenForMobile: null,
        isProtected: false,
        isPublicEmail: false,
        isEnabledNotificationEmail: true,
        isEnabledNotificationMessage: true,
        isEnabledNotificationPostLike: true,
        isEnabledNotificationPostQuotation: true,
      })

      const transaction = await this.userRepository.upsert(user)

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
