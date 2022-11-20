import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { Id, PostText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreateReplyMutation } from "interface/posts/validations/createReplyMutation"
import { CreateReplyService } from "service"

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
    const service = container.resolve(CreateReplyService)

    const result = await service.execute({
      postId: props.postId,
      text: props.text,
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(createReply, "createReply")
