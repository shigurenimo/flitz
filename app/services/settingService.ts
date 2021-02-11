import { Id } from "integrations/domain/valueObjects"
import { SettingRepository } from "integrations/infrastructure/repositories"

export class SettingService {
  settingRepository: SettingRepository

  constructor() {
    this.settingRepository = new SettingRepository()
  }

  async createAndGetSetting(input: { userId: Id }) {
    const setting = await this.settingRepository.getSetting({
      userId: input.userId,
    })

    if (setting !== null) {
      return setting
    }

    await this.settingRepository.createSetting({ userId: input.userId })

    return this.settingRepository.getSetting({ userId: input.userId })
  }
}
