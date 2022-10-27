import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import {
  CountUserReferencesQuery,
  FindUserReferenceQuery,
  MarkReferenceAsReadService,
} from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"

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
    const findUserReferenceQuery = container.resolve(FindUserReferenceQuery)

    const references = await findUserReferenceQuery.execute({
      skip: props.skip,
      userId: props.userId,
    })

    if (references instanceof Error) {
      throw references
    }

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

    const countUserReferencesQuery = container.resolve(CountUserReferencesQuery)

    const count = await countUserReferencesQuery.execute({
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
