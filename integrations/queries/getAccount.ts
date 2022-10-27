import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { FindUserSimpleQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
    const findUserSimpleQuery = container.resolve(FindUserSimpleQuery)

    const user = await findUserSimpleQuery.execute(props.userId)

    if (user instanceof Error) {
      throw user
    }

    return user
  }
)

export default withSentry(getAccount, "getAccount")
