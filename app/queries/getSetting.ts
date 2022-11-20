import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { FindUserSettingQuery } from "service"

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
    const query = container.resolve(FindUserSettingQuery)

    const setting = await query.execute({ userId: props.userId })

    if (setting instanceof Error) {
      throw setting
    }

    return setting
  }
)

export default withSentry(getSetting, "getSetting")
