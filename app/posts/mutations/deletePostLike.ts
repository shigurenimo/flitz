import { withSentry } from "app/core/utils/withSentry"
import { zDeletePostLikeMutation } from "app/posts/validations/deletePostLikeMutation"
import { resolver } from "blitz"
import { DeletePostLikeService } from "integrations/application/post/deletePostLike.service"
import { Id } from "integrations/domain"
import { container } from "tsyringe"

const deletePostLike = resolver.pipe(
  resolver.zod(zDeletePostLikeMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      postId: new Id(props.postId),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const deletePostLikeService = container.resolve(DeletePostLikeService)

    await deletePostLikeService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    return null
  }
)

export default withSentry(deletePostLike, "deletePostLike")
