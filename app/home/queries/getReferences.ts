import { withSentry } from "app/core/utils/withSentry"
import { paginate, resolver } from "blitz"
import {
  CountReferencesQuery,
  FindReferenceQuery,
  MarkReferenceAsReadService,
} from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.object({ skip: z.number() })

const getReferences = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findReferenceQuery = container.resolve(FindReferenceQuery)

    const references = await findReferenceQuery.execute({
      skip: props.skip,
      userId: props.userId,
    })

    const unreadReferences = references.filter((reference) => {
      return !reference.isRead
    })

    const hasUnreadReferences = unreadReferences.length > 0

    const markReferenceAsReadService = container.resolve(
      MarkReferenceAsReadService
    )

    if (hasUnreadReferences) {
      await markReferenceAsReadService.execute({ userId: props.userId })
    }

    const countReferencesQuery = container.resolve(CountReferencesQuery)

    const count = await countReferencesQuery.execute({ userId: props.userId })

    return paginate({
      skip: props.skip,
      take: 40,
      async count() {
        return count
      },
      async query() {
        return references
      },
    })
  }
)

export default withSentry(getReferences, "getReferences")
