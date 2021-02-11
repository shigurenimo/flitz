import { resolver } from "blitz"
import {
  Id,
  PageService,
  ReferenceService,
  Skip,
  skipSchema,
  Take,
} from "integrations/domain"
import { ReferenceRepository } from "integrations/infrastructure"
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
    const referenceRepository = new ReferenceRepository()

    const {
      references,
      referenceEntities,
    } = await referenceRepository.findReferences({
      skip,
      userId,
    })

    const referenceService = new ReferenceService()

    const hasUnreadReferences = referenceService.hasUnreadReferences({
      referenceEntities,
    })

    if (hasUnreadReferences) {
      await referenceRepository.markReferencesAsRead({ userId })
    }

    const count = await referenceRepository.countReferences({ userId })

    const take = new Take()

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { hasMore, references, nextPage }
  }
)
