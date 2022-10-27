import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserSettingQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
