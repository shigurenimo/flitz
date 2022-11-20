import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import {
  CountUserReferencesQuery,
  FindUserReferenceQuery,
  MarkReferenceAsReadService,
} from "service"

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
    const query = container.resolve(FindUserReferenceQuery)

    const references = await query.execute({
      skip: props.skip,
      userId: props.userId,
    })

    if (references instanceof Error) {
      throw references
    }

    const unreadReferences = references.filter((reference) => {
      return !reference.isRead
    })

    const hasUnreadReferences = 0 < unreadReferences.length

    const markReferenceAsReadService = container.resolve(
      MarkReferenceAsReadService
    )

    if (hasUnreadReferences) {
      await markReferenceAsReadService.execute({ userId: props.userId })
    }

    const countQuery = container.resolve(CountUserReferencesQuery)

    const count = await countQuery.execute({
      userId: props.userId,
    })

    if (count instanceof Error) {
      throw count
    }

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
