import { zCreateQuotation } from "app/posts/validations/createQuotationMutation"
import { resolver } from "blitz"
import { CreateQuotationService } from "integrations/application"
import { Id } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zCreateQuotation),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(CreateQuotationService).call({
      postId: input.postId,
      userId: input.userId,
    })

    return null
  }
)
