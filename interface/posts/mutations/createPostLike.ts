import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CreatePostLikeService } from "application"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreatePostLikeMutation } from "interface/posts/validations/createPostLikeMutation"

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
