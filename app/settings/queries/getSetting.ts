import { SettingService } from "app/services"
import { resolver } from "blitz"
import { Id } from "integrations/domain"
import * as z from "zod"

const GetSetting = z.null()

export default resolver.pipe(
  resolver.zod(GetSetting),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const settingService = new SettingService()

    const { setting } = await settingService.createAndGetSetting({ userId })

    if (setting === null) {
      throw new Error("")
    }

    return {
      ...setting,
      fcmToken: setting.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
    }
  }
)
