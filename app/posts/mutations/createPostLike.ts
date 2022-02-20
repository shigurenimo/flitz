import { zCreatePostLikeMutation } from "app/posts/validations/createPostLikeMutation"
import { resolver } from "blitz"
import { CreatePostLikeService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zCreatePostLike = z.object({ postId: z.string() })

const createPostLike = resolver.pipe(
  resolver.zod(zCreatePostLikeMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      postId: new Id(props.postId),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createPostLikeService = container.resolve(CreatePostLikeService)

    await createPostLikeService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    return null
  }
)

export default createPostLike
