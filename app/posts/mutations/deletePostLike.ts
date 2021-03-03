import { zDeletePostLikeMutation } from "app/posts/validations/deletePostLikeMutation"
import { resolver } from "blitz"
import { DeletePostLikeService } from "integrations/application/deletePostLike.service"
import { Id } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zDeletePostLikeMutation),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(DeletePostLikeService).call({
      postId: input.postId,
      userId: input.userId,
    })

    return null
  }
)
