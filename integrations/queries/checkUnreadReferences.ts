import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CheckUnreadUserReferenceQuery } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const checkUnreadReferences = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const query = container.resolve(CheckUnreadUserReferenceQuery)

    const hasUnread = await query.execute({
      userId: props.userId,
    })

    if (hasUnread instanceof Error) {
      throw hasUnread
    }

    return hasUnread
  }
)

export default withSentry(checkUnreadReferences, "checkUnreadReferences")
