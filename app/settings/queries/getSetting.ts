import { Ctx } from "blitz"
import { SessionRepository } from "infrastructure/repositories"
import { SettingService } from "services"

const getSetting = async (_: any, ctx: Ctx) => {
  ctx.session.authorize()

  const sessionRepository = new SessionRepository()

  const userId = sessionRepository.getUserId(ctx.session)

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

export default getSetting
