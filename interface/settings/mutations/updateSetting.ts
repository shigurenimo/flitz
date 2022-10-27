import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserSettingQuery, UpdateUserSettingService } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zUpdateSettingMutation = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  isEnabledNotificationMessage: z.boolean().optional(),
  isEnabledNotificationPostLike: z.boolean().optional(),
  isEnabledNotificationPostQuotation: z.boolean().optional(),
})

const updateSetting = resolver.pipe(
  resolver.zod(zUpdateSettingMutation),
  resolver.authorize(),
  async (props, ctx) => {
    const updateSettingService = container.resolve(UpdateUserSettingService)

    const transaction = await updateSettingService.execute({
      fcmTokenForMobile: props.fcmTokenForMobile ?? null,
      fcmToken: props.fcmToken ?? null,
      userId: new Id(ctx.session.userId),
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    const findUserSettingQuery = container.resolve(FindUserSettingQuery)

    const appSetting = await findUserSettingQuery.execute({
      userId: new Id(ctx.session.userId),
    })

    if (appSetting instanceof Error) {
      throw appSetting
    }

    return appSetting
  }
)

export default withSentry(updateSetting, "updateSetting")
