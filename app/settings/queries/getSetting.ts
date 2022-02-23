import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { FindUserSettingQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.null()

const getSetting = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findUserSettingQuery = container.resolve(FindUserSettingQuery)

    const setting = await findUserSettingQuery.execute({ userId: props.userId })

    if (setting instanceof Error) {
      throw setting
    }

    return setting
  }
)

export default withSentry(getSetting, "getSetting")
