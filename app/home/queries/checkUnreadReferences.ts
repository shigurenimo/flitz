import { resolver } from "blitz"
import { ReferenceQuery } from "integrations/application"
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
    const referenceQuery = container.resolve(ReferenceQuery)

    const hasUnread = await referenceQuery.hasUnread(props.userId)

    return hasUnread
  }
)

export default checkUnreadReferences
