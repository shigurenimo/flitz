import db from "db"
// import { FileEntityFactory } from "domain/factories"
import { Id } from "domain/valueObjects"

export class SettingRepository {
  static createSetting(input: { userId: Id }) {
    return db.setting.create({
      data: {
        user: { connect: { id: input.userId.value } },
      },
    })
  }

  static async getSetting(input: { userId: Id }) {
    return db.setting.findUnique({
      where: { userId: input.userId.value },
    })
  }

  static async updateSetting(input: {
    userId: Id
    fcmToken?: string | null
    fcmTokenForMobile?: string | null
    subscribeMessage?: boolean
    subscribePostLike?: boolean
    subscribePostQuotation?: boolean
  }) {
    return db.setting.update({
      data: {
        fcmToken: input.fcmToken,
        fcmTokenForMobile: input.fcmTokenForMobile,
        subscribeMessage: input.subscribeMessage,
        subscribePostLike: input.subscribePostLike,
        subscribePostQuotation: input.subscribePostQuotation,
      },
      where: { userId: input.userId.value },
    })
  }
}
