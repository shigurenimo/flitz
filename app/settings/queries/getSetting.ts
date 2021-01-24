import { Ctx } from "blitz"
import { SessionRepository } from "infrastructure"
import { SettingService } from "services"

const getSetting = async (_: any, ctx: Ctx) => {
  ctx.session.authorize()

  const userId = SessionRepository.getUserId(ctx.session)

  const setting = await SettingService.createAndGetSetting({ userId })

  if (setting === null) {
    throw new Error("")
  }

  return {
    ...setting,
    fcmToken: setting.fcmToken?.slice(0, 4) || null,
    fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
  }
}

export default getSetting
