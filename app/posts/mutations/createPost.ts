import { zCreatePostMutation } from "app/posts/validations/createPostMutation"
import { resolver } from "blitz"
import { CreateFileService, CreatePostService } from "integrations/application"
import { Id, ImageFactory, PostText } from "integrations/domain"
import { createAppContext } from "integrations/registry"

export default resolver.pipe(
  resolver.zod(zCreatePostMutation),
  resolver.authorize(),
  (input, ctx) => ({
    image: ImageFactory.fromDataURL(input.image),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async (input) => {
    const app = await createAppContext()

    const fileEntity = await app.get(CreateFileService).call({
      userId: input.userId,
      image: input.image,
    })

    await app.get(CreatePostService).call({
      fileIds: fileEntity ? [fileEntity.id] : [],
      text: input.text,
      userId: input.userId,
    })

    return null
  }
)
