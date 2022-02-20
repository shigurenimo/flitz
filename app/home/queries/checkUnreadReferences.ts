import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { HasUnreadReferenceQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const checkUnreadReferences = resolver.pipe(
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const hasUnreadReferenceQuery = container.resolve(HasUnreadReferenceQuery)

    const hasUnread = await hasUnreadReferenceQuery.execute({
      userId: props.userId,
    })

    return hasUnread
  }
)

export default withSentry(checkUnreadReferences, "checkUnreadReferences")
