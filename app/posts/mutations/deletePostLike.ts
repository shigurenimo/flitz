import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { withSentry } from "app/core/utils/withSentry"
import { zDeletePostLikeMutation } from "app/posts/validations/deletePostLikeMutation"
import { DeletePostLikeService } from "integrations/application/post/deletePostLike.service"
import { Id } from "integrations/domain"

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

    const transaction = await deletePostLikeService.execute({
      postId: props.postId,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(deletePostLike, "deletePostLike")
