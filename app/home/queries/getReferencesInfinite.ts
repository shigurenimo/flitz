import { paginate, resolver } from "blitz"
import { ReferenceQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { ReferenceRepository } from "integrations/infrastructure"
import { container } from "tsyringe"
import { z } from "zod"

export const GetReferencesInfinite = z.object({ skip: z.number() })

const getReferencesInfinite = resolver.pipe(
  resolver.zod(GetReferencesInfinite),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const referenceQuery = container.resolve(ReferenceQuery)

    const references = await referenceQuery.findMany({
      skip: props.skip,
      userId: props.userId,
    })

    const unreadReferences = references.filter((reference) => {
      return !reference.isRead
    })

    const hasUnreadReferences = unreadReferences.length > 0

    const referenceRepository = container.resolve(ReferenceRepository)

    if (hasUnreadReferences) {
      await referenceRepository.markAsRead(props.userId)
    }

    const count = await referenceQuery.count(props.userId)

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

export default getReferencesInfinite
