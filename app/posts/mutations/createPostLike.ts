import { withSentry } from "app/core/utils/withSentry"
import { zCreatePostLikeMutation } from "app/posts/validations/createPostLikeMutation"
import { resolver } from "blitz"
import { CreatePostLikeService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

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

    const transaction = await createPostLikeService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(createPostLike, "createPostLike")
