import { Setting } from "db"
import { SettingEntity } from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

export interface ISettingRepository {
  /**
   * TODO: 集約
   * @param input
   */
  create(input: { userId: Id }): Promise<null>

  getSetting(input: {
    userId: Id
  }): Promise<{
    setting: Setting | null
    settingEntity: SettingEntity | null
  }>

  /**
   * TODO: 集約
   * @param input
   */
  updateSetting(input: {
    userId: Id
    fcmToken?: string | null
    fcmTokenForMobile?: string | null
    subscribeMessage?: boolean
    subscribePostLike?: boolean
    subscribePostQuotation?: boolean
  }): Promise<{
    setting: Setting
    settingEntity: SettingEntity
  }>
}
