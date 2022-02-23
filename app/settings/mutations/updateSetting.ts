import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { UpdateSettingService } from "integrations/application"
import { Id } from "integrations/domain"
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
  (props, ctx) => {
    return {
      fcmToken: props.fcmToken || null,
      fcmTokenForMobile: props.fcmTokenForMobile || null,
      subscribeMessage: props.subscribeMessage || false,
      subscribePostLike: props.subscribePostLike || false,
      subscribePostQuotation: props.subscribePostQuotation || false,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const updateSettingService = container.resolve(UpdateSettingService)

    const setting = await updateSettingService.execute({
      fcmTokenForMobile: props.fcmTokenForMobile,
      fcmToken: props.fcmToken,
      userId: props.userId,
    })

    if (setting instanceof Error) {
      throw setting
    }

    return {
      fcmToken: setting.fcmToken?.slice(0, 4) || null,
      fcmTokenForMobile: setting.fcmTokenForMobile?.slice(0, 4) || null,
      id: setting.id.value,
      notificationEmail: setting.notificationEmail?.value || null,
      protected: setting.protected,
      subscribeMessage: setting.subscribeMessage,
      subscribePostLike: setting.subscribePostLike,
      subscribePostQuotation: setting.subscribePostQuotation,
      discoverableByEmail: setting.discoverableByEmail,
    }
  }
)

export default withSentry(updateSetting, "updateSetting")
