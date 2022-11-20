import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { FindUserSimpleQuery } from "service"

const zProps = z.null()

const getAccount = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const query = container.resolve(FindUserSimpleQuery)

    const user = await query.execute(props.userId)

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(getAccount, "getAccount")
