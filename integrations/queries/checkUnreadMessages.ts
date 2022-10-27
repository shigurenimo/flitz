import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CheckUnreadMessageThreadQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
