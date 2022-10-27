import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CreateReplyService } from "application"
import { Id, PostText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreateReplyMutation } from "interface/posts/validations/createReplyMutation"

const createReply = resolver.pipe(
  resolver.zod(zCreateReplyMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      postId: new Id(props.postId),
      text: new PostText(props.text),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createReplyService = container.resolve(CreateReplyService)

    const transaction = await createReplyService.execute({
      postId: props.postId,
      text: props.text,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(createReply, "createReply")
