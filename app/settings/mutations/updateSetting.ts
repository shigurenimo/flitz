import { resolver } from "blitz"
import { UpdateSettingService } from "integrations/application"
import { Id } from "integrations/domain"
import { QuerySetting } from "integrations/interface/types/querySetting"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const zUpdateSettingMutation = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  subscribeMessage: z.boolean().optional(),
  subscribePostLike: z.boolean().optional(),
  subscribePostQuotation: z.boolean().optional(),
})

export default resolver.pipe(
  resolver.zod(zUpdateSettingMutation),
  resolver.authorize(),
  (input, ctx) => ({
    fcmToken: input.fcmToken || null,
    fcmTokenForMobile: input.fcmTokenForMobile || null,
    subscribeMessage: input.subscribeMessage || false,
    subscribePostLike: input.subscribePostLike || false,
    subscribePostQuotation: input.subscribePostQuotation || false,
    userId: new Id(ctx.session.userId),
  }),
  async (input): Promise<QuerySetting> => {
    const app = await createAppContext()

    const settingEntity = await app.get(UpdateSettingService).call({
      fcmTokenForMobile: input.fcmTokenForMobile,
      fcmToken: input.fcmToken,
      userId: input.userId,
    })

    if (settingEntity instanceof Error) {
      throw new Error()
    }

    return {
      fcmToken: settingEntity.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: settingEntity.fcmTokenForMobile?.slice(0, 4) || null,
      id: settingEntity.id.value,
      notificationEmail: settingEntity.notificationEmail?.value || null,
      protected: settingEntity.protected,
      subscribeMessage: settingEntity.subscribeMessage,
      subscribePostLike: settingEntity.subscribePostLike,
      subscribePostQuotation: settingEntity.subscribePostQuotation,
      discoverableByEmail: settingEntity.discoverableByEmail,
    }
  }
)
