import db from "db"
import { Id } from "integrations/domain/valueObjects"

export class UserSettingQuery {
  async has(input: { userId: Id }) {
    const setting = await db.setting.findUnique({
      where: { userId: input.userId.value },
    })

    return setting === null
  }

  async find(input: { userId: Id }) {
    const setting = await db.setting.findUnique({
      where: { userId: input.userId.value },
    })

    if (setting === null) return null

    return {
      ...setting,
      fcmToken: setting.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
    }
  }
}
