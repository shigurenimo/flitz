import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { CreateFileService, CreatePostService } from "application"
import { Id, PostText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreatePostMutation } from "interface/posts/validations/createPostMutation"

const createPost = resolver.pipe(
  resolver.zod(zCreatePostMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      fileId: props.fileId ? new Id(props.fileId) : null,
      text: new PostText(props.text),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createFileService = container.resolve(CreateFileService)

    if (props.fileId !== null) {
      const file = await createFileService.execute({
        userId: props.userId,
        fileId: props.fileId,
      })

      if (file instanceof Error) {
        throw file
      }
    }

    const createPostService = container.resolve(CreatePostService)

    const transaction = await createPostService.execute({
      fileIds: props.fileId ? [props.fileId] : [],
      text: props.text,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(createPost, "createPost")
