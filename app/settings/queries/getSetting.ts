import { NotFoundError, resolver } from "blitz"
import { Id } from "integrations/domain"
import { UserSettingQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

const GetSetting = z.null()

export default resolver.pipe(
  resolver.zod(GetSetting),
  resolver.authorize(),
  (_, ctx) => ({
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    const setting = await app
      .get(UserSettingQuery)
      .find({ userId: input.userId })

    if (setting === null) {
      throw new NotFoundError()
    }

    return setting
  }
)
