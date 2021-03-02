import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import { Id, SettingRepository } from "integrations/domain"

@Injectable()
export class UpdateSettingService {
  constructor(private settingRepository: SettingRepository) {}

  async call(input: {
    fcmTokenForMobile: string | null
    fcmToken: string | null
    userId: Id
  }) {
    try {
      const settingEntity = await this.settingRepository.findByUserId(
        input.userId
      )

      if (settingEntity === null) {
        throw new NotFoundError()
      }

      await this.settingRepository.upsert(
        settingEntity.update({
          fcmToken: input.fcmToken,
          fcmTokenForMobile: input.fcmTokenForMobile,
        })
      )

      return settingEntity
    } catch (error) {
      return Error()
    }
  }
}
