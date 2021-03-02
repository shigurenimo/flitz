import { zCreatePostLikeMutation } from "app/posts/validations/createPostLikeMutation"
import { resolver } from "blitz"
import { CreatePostLikeService } from "integrations/application"
import { Id, zId } from "integrations/domain"
import { createAppContext } from "integrations/registry"
import * as z from "zod"

export const CreatePostLike = z.object({ postId: zId })

export default resolver.pipe(
  resolver.zod(zCreatePostLikeMutation),
  resolver.authorize(),
  (input, ctx) => ({
    postId: new Id(input.postId),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    await app.get(CreatePostLikeService).call({
      postId: input.postId,
      userId: input.userId,
    })

    return null
  }
)
