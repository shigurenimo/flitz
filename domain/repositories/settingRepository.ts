import { Setting } from "db"
import { SettingEntity } from "domain/entities"
import type { Id } from "domain/valueObjects"

export interface ISettingRepository {
  createSetting(input: { userId: Id }): Promise<null>

  getSetting(input: {
    userId: Id
  }): Promise<{
    setting: Setting | null
    settingEntity: SettingEntity | null
  }>

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
