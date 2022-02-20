import { withSentry } from "app/core/utils/withSentry"
import { zCreatePostMutation } from "app/posts/validations/createPostMutation"
import { resolver } from "blitz"
import { CreateFileService, CreatePostService } from "integrations/application"
import { Id, ImageFactory, PostText } from "integrations/domain"
import { container } from "tsyringe"

const createPost = resolver.pipe(
  resolver.zod(zCreatePostMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      image: ImageFactory.fromDataURL(props.image),
      text: new PostText(props.text),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createFileService = container.resolve(CreateFileService)

    const file = await createFileService.execute({
      userId: props.userId,
      image: props.image,
    })

    if (file instanceof Error) {
      throw file
    }

    const createPostService = container.resolve(CreatePostService)

    await createPostService.execute({
      fileIds: file ? [file.id] : [],
      text: props.text,
      userId: props.userId,
    })

    return null
  }
)

export default withSentry(createPost, "createPost")
