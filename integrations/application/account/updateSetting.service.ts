import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { SettingRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  fcmTokenForMobile: string | null
  fcmToken: string | null
  userId: Id
}

@injectable()
export class UpdateSettingService {
  constructor(private settingRepository: SettingRepository) {}

  /**
   * @deprecated
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const setting = await this.settingRepository.findByUserId(props.userId)

      if (setting === null) {
        throw new NotFoundError()
      }

      await this.settingRepository.upsert(
        setting.updateFcmToken(props.fcmToken, props.fcmTokenForMobile)
      )

      return setting
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
