import { ReferenceRepository } from "app/domain/repositories"
import { PageService } from "app/domain/services"
import { ReferenceService } from "app/domain/services/referenceService"
import { Id, Skip, skipSchema, Take } from "app/domain/valueObjects"
import { Ctx } from "blitz"
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

  const references = await ReferenceRepository.findReferences({ skip, userId })

  const hasUnreadReferences = ReferenceService.hasUnreadReferences({
    references,
  })

  if (hasUnreadReferences) {
    await ReferenceRepository.markReferencesAsRead({ userId })
  }

  const count = await ReferenceRepository.countReferences({ userId })

  const take = new Take()

  const hasMore = PageService.hasMore({ count, skip, take })

  const nextPage = hasMore ? PageService.nextPage({ take, skip }) : null

  return { hasMore, references, nextPage }
}

export default getReferencesInfinite
