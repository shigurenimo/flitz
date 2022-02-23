import { captureException } from "@sentry/node"
import {
  Email,
  HashedPasswordFactory,
  IdFactory,
  Password,
  SettingEntity,
  ShortText,
  UserEntity,
  UsernameFactory,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import { SettingRepository, UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  password: Password
  email: Email
}

@injectable()
export class SignUpService {
  constructor(
    private userRepository: UserRepository,
    private settingRepository: SettingRepository
  ) {}

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

      const settingId = IdFactory.nanoid()

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
        settingId: settingId,
      })

      const transactionUser = await this.userRepository.upsert(user)

      if (transactionUser instanceof Error) {
        return new InternalError()
      }

      const setting = new SettingEntity({
        id: settingId,
        discoverableByEmail: false,
        fcmToken: null,
        fcmTokenForMobile: null,
        notificationEmail: null,
        protected: false,
        subscribeMessage: false,
        subscribePostLike: false,
        subscribePostQuotation: false,
        userId: userId,
      })

      const transactionSetting = await this.settingRepository.upsert(setting)

      if (transactionSetting instanceof Error) {
        return new InternalError()
      }

      return user
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
