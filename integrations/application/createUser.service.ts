import { Injectable } from "@nestjs/common"
import { SessionContext } from "blitz"
import {
  Biography,
  Email,
  HashedPasswordFactory,
  IdFactory,
  Password,
  SettingEntity,
  SettingRepository,
  UserEntity,
  UserRepository,
  UserRole,
} from "integrations/domain"
import { SessionRepository } from "integrations/infrastructure"

@Injectable()
export class SignUpService {
  constructor(
    private userRepository: UserRepository,
    private settingRepository: SettingRepository,
    private sessionRepository: SessionRepository
  ) {}

  async call(input: {
    session: SessionContext
    password: Password
    email: Email
  }) {
    try {
      const hashedPassword = await HashedPasswordFactory.fromPassword(
        input.password
      )

      const settingId = IdFactory.create()

      const userId = IdFactory.create()

      const userEntity = new UserEntity({
        biography: new Biography(""),
        hashedPassword,
        headerImageId: null,
        iconImageId: null,
        id: userId,
        name: null,
        username: IdFactory.createUsername(),
        email: input.email,
        settingId: settingId,
      })

      const upsertUser = await this.userRepository.upsert(userEntity)

      if (upsertUser instanceof Error) {
        return upsertUser
      }

      const settingEntity = new SettingEntity({
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

      const upsertSetting = await this.settingRepository.upsert(settingEntity)

      if (upsertSetting instanceof Error) {
        console.log(upsertSetting)
        return upsertSetting
      }

      await this.sessionRepository.createSession(input.session, {
        name: userEntity.name,
        role: new UserRole("USER"),
        userId: userEntity.id,
        username: userEntity.username,
        iconImageId: null,
      })

      return null
    } catch (error) {
      return Error()
    }
  }
}
