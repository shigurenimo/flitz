import { zCreateReplyMutation } from "app/posts/validations/createReplyMutation"
import { resolver } from "blitz"
import { CreateReplyService } from "integrations/application"
import { Id, PostText } from "integrations/domain"
import { container } from "tsyringe"

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

    await createReplyService.execute({
      postId: props.postId,
      text: props.text,
      userId: props.userId,
    })

    return null
  }
)

export default createReply
