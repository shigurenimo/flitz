import { Ctx } from "blitz"
import { PageService } from "domain/services"
import { ReferenceService } from "domain/services/referenceService"
import { Id, Skip, skipSchema, Take } from "domain/valueObjects"
import { ReferenceRepository } from "infrastructure/repositories"
import * as z from "zod"

export const inputSchema = z.object({ skip: skipSchema })

const getReferencesInfinite = async (
  input: z.infer<typeof inputSchema>,
  ctx: Ctx
) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const skip = new Skip(input.skip)

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

export default getReferencesInfinite
