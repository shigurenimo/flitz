import { resolver } from "blitz"
import { UpdateSettingService } from "integrations/application"
import { Id } from "integrations/domain"
import { AppSetting } from "integrations/interface/types/appSetting"
import { container } from "tsyringe"
import { z } from "zod"

const zUpdateSettingMutation = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  subscribeMessage: z.boolean().optional(),
  subscribePostLike: z.boolean().optional(),
  subscribePostQuotation: z.boolean().optional(),
})

const updateSetting = resolver.pipe(
  resolver.zod(zUpdateSettingMutation),
  resolver.authorize(),
  (props, ctx) => ({
    fcmToken: props.fcmToken || null,
    fcmTokenForMobile: props.fcmTokenForMobile || null,
    subscribeMessage: props.subscribeMessage || false,
    subscribePostLike: props.subscribePostLike || false,
    subscribePostQuotation: props.subscribePostQuotation || false,
    userId: new Id(ctx.session.userId),
  }),
  async (props): Promise<AppSetting> => {
    const updateSettingService = container.resolve(UpdateSettingService)

    const settingEntity = await updateSettingService.execute({
      fcmTokenForMobile: props.fcmTokenForMobile,
      fcmToken: props.fcmToken,
      userId: props.userId,
    })

    if (settingEntity instanceof Error) {
      throw settingEntity
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

export default updateSetting
