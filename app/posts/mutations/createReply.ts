import { zCreateReplyMutation } from "app/posts/validations/createReplyMutation"
import { resolver } from "blitz"
import { CreateReplyService } from "integrations/application"
import { Id, PostText } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zCreateReplyMutation),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(CreateReplyService).call({
      postId: input.postId,
      text: input.text,
      userId: input.userId,
    })

    return null
  }
)
