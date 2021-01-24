import { Ctx } from "blitz"
import { SessionRepository, SettingRepository } from "infrastructure"
import * as z from "zod"

const inputSchema = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  subscribeMessage: z.boolean().optional(),
  subscribePostLike: z.boolean().optional(),
  subscribePostQuotation: z.boolean().optional(),
})

type Input = z.infer<typeof inputSchema>

const updateSetting = async (input: Input, ctx: Ctx) => {
  ctx.session.authorize()

  const {
    fcmToken,
    fcmTokenForMobile,
    subscribeMessage,
    subscribePostLike,
    subscribePostQuotation,
  } = inputSchema.parse(input)

  const userId = SessionRepository.getUserId(ctx.session)

  const setting = await SettingRepository.updateSetting({
    fcmToken,
    fcmTokenForMobile,
    subscribeMessage,
    subscribePostLike,
    subscribePostQuotation,
    userId,
  })

  return {
    ...setting,
    fcmToken: setting.fcmToken?.slice(0, 4) || null,
    fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
  }
}

export default updateSetting
