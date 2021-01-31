import db from "db"
import { ISettingRepository } from "domain/repositories"
import { Id } from "domain/valueObjects"
import { PrismaAdapter } from "infrastructure/adapters"

export class SettingRepository implements ISettingRepository {
  async createSetting(input: { userId: Id }) {
    await db.setting.create({
      data: {
        user: { connect: { id: input.userId.value } },
      },
    })

    return null
  }

  async getSetting(input: { userId: Id }) {
    const setting = await db.setting.findUnique({
      where: { userId: input.userId.value },
    })

    const settingEntity = new PrismaAdapter().toSettingEntity(setting)

    return { setting, settingEntity }
  }

  async updateSetting(input: {
    userId: Id
    fcmToken?: string | null
    fcmTokenForMobile?: string | null
    subscribeMessage?: boolean
    subscribePostLike?: boolean
    subscribePostQuotation?: boolean
  }) {
    const setting = await db.setting.update({
      data: {
        fcmToken: input.fcmToken,
        fcmTokenForMobile: input.fcmTokenForMobile,
        subscribeMessage: input.subscribeMessage,
        subscribePostLike: input.subscribePostLike,
        subscribePostQuotation: input.subscribePostQuotation,
      },
      where: { userId: input.userId.value },
    })

    const settingEntity = new PrismaAdapter().toSettingEntity(setting)

    return { setting, settingEntity }
  }
}
