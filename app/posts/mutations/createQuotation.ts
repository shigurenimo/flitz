import { withSentry } from "app/core/utils/withSentry"
import { zCreateQuotation } from "app/posts/validations/createQuotationMutation"
import { resolver } from "blitz"
import { CreateQuotationService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const createQuotation = resolver.pipe(
  resolver.zod(zCreateQuotation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      postId: new Id(props.postId),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createQuotationService = container.resolve(CreateQuotationService)

    const transaction = await createQuotationService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(createQuotation, "createQuotation")
