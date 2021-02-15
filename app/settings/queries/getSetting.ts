import { NotFoundError, resolver } from "blitz"
import { Id } from "integrations/domain"
import {
  SettingRepository,
  UserSettingQuery,
} from "integrations/infrastructure"
import * as z from "zod"

const GetSetting = z.null()

export default resolver.pipe(
  resolver.zod(GetSetting),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async ({ userId }) => {
    const userSettingQuery = new UserSettingQuery()

    const hasSetting = await userSettingQuery.has({ userId })

    if (hasSetting) {
      const settingRepository = new SettingRepository()

      await settingRepository.create({ userId })
    }

    const setting = await userSettingQuery.find({ userId })

    if (setting === null) {
      throw new NotFoundError()
    }

    return setting
  }
)
