import { resolver } from "blitz"
import {
  Id,
  PageService,
  ReferenceService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import {
  ReferenceQuery,
  ReferenceRepository,
} from "integrations/infrastructure"
import * as z from "zod"

export const GetReferencesInfinite = z.object({ skip: skipSchema })

export default resolver.pipe(
  resolver.zod(GetReferencesInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    userId: new Id(ctx.session.userId),
  }),
  async ({ skip, userId }) => {
    const referenceQuery = new ReferenceQuery()

    const references = await referenceQuery.findMany({ skip, userId })

    const referenceService = new ReferenceService()

    const hasUnreadReferences = referenceService.hasUnread({ references })

    if (hasUnreadReferences) {
      const referenceRepository = new ReferenceRepository()

      await referenceRepository.markReferencesAsRead({ userId })
    }

    const count = await referenceQuery.count({ userId })

    const take = new Take()

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, references, nextPage }
  }
)
