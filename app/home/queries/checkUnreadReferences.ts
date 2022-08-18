import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { withSentry } from "app/core/utils/withSentry"
import { CheckUnreadUserReferenceQuery } from "integrations/application"
import { Id } from "integrations/domain"

const checkUnreadReferences = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const checkUnreadUserReferenceQuery = container.resolve(
      CheckUnreadUserReferenceQuery
    )

    const hasUnread = await checkUnreadUserReferenceQuery.execute({
      userId: props.userId,
    })

    if (hasUnread instanceof Error) {
      throw hasUnread
    }

    return hasUnread
  }
)

export default withSentry(checkUnreadReferences, "checkUnreadReferences")
