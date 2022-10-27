import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CreateQuotationService } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreateQuotation } from "interface/posts/validations/createQuotationMutation"

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
