import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { CheckUnreadMessageThreadQuery } from "service"

const checkUnreadMessages = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const query = container.resolve(CheckUnreadMessageThreadQuery)

    const existence = await query.execute({
      userId: props.userId,
    })

    if (existence instanceof Error) {
      throw existence
    }

    return existence
  }
)

export default withSentry(checkUnreadMessages, "checkUnreadMessages")
