import { captureException } from "@sentry/node"
import { SessionContext } from "blitz"
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
  session: SessionContext
  password: Password
  email: Email
}

@injectable()
export class SignUpService {
  constructor(
    private userRepository: UserRepository,
    private settingRepository: SettingRepository
  ) {}

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

      const upsertUser = await this.userRepository.upsert(user)

      if (upsertUser instanceof Error) {
        return upsertUser
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

      const upsertSetting = await this.settingRepository.upsert(setting)

      if (upsertSetting instanceof Error) {
        return upsertSetting
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
