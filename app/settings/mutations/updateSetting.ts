import { resolver } from "blitz"
import { Id } from "integrations/domain"
import { SettingRepository } from "integrations/infrastructure"
import * as z from "zod"

const UpdateSetting = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  subscribeMessage: z.boolean().optional(),
  subscribePostLike: z.boolean().optional(),
  subscribePostQuotation: z.boolean().optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateSetting),
  resolver.authorize(),
  (input, ctx) => ({
    ...input,
    userId: new Id(ctx.session.userId),
  }),
  async ({
    fcmToken,
    fcmTokenForMobile,
    subscribeMessage,
    subscribePostLike,
    subscribePostQuotation,
    userId,
  }) => {
    const settingRepository = new SettingRepository()

    const { setting } = await settingRepository.updateSetting({
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
)
