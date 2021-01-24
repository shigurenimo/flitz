import { Id } from "domain/valueObjects"
import { SettingRepository } from "infrastructure"

export class SettingService {
  static async createAndGetSetting(input: { userId: Id }) {
    const setting = await SettingRepository.getSetting({ userId: input.userId })

    if (setting !== null) {
      return setting
    }

    await SettingRepository.createSetting({ userId: input.userId })

    return SettingRepository.getSetting({ userId: input.userId })
  }
}
