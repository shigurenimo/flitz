import { NotFoundError, resolver } from "blitz"
import { UserSettingQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zGetSetting = z.null()

const getSetting = resolver.pipe(
  resolver.zod(zGetSetting),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const userSettingQuery = container.resolve(UserSettingQuery)

    const setting = await userSettingQuery.find({ userId: props.userId })

    if (setting === null) {
      throw new NotFoundError()
    }

    return setting
  }
)

export default getSetting
