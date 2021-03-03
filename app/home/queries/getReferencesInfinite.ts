import { resolver } from "blitz"
import {
  Id,
  PageService,
  ReferenceRepository,
  ReferenceService,
  Skip,
  Take,
  zSkip,
} from "integrations/domain"
import { ReferenceQuery } from "integrations/infrastructure"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

export const GetReferencesInfinite = z.object({ skip: zSkip })

export default resolver.pipe(
  resolver.zod(GetReferencesInfinite),
  resolver.authorize(),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    userId: new Id(ctx.session.userId),
  }),
  async ({ skip, userId }) => {
    const app = await createAppContext()

    const references = await app.get(ReferenceQuery).findMany({ skip, userId })

    const hasUnreadReferences = app
      .get(ReferenceService)
      .hasUnread({ references })

    if (hasUnreadReferences) {
      await app.get(ReferenceRepository).markAsRead(userId)
    }

    const count = await app.get(ReferenceQuery).count(userId)

    const take = new Take()

    const hasMore = app.get(PageService).hasMore(skip, take, count)

    const nextPage = hasMore ? app.get(PageService).nextPage(take, skip) : null

    return { hasMore, references, nextPage }
  }
)
