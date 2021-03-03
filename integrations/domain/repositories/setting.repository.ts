import { SettingEntity } from "integrations/domain/entities"
import type { Id } from "integrations/domain/valueObjects"

export abstract class SettingRepository {
  /**
   * @param input
   */
  abstract upsert(setting: SettingEntity): Promise<null | Error>

  abstract findByUserId(userId: Id): Promise<SettingEntity | null>
}
