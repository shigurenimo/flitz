import { UploadFileService } from "app/services"
import { resolver } from "blitz"
import { Id, ImageFactory, PostText, postTextSchema } from "integrations/domain"
import {
  EnvRepository,
  FileRepository,
  FriendshipRepository,
  ImageRepository,
  PostRepository,
  StorageRepository,
} from "integrations/infrastructure"
import * as z from "zod"

export const CreatePost = z.object({
  // base64 workaround. see onCreatePost in HomePageInput
  image: z.string().nullable(),
  text: postTextSchema,
})

export default resolver.pipe(
  resolver.zod(CreatePost),
  resolver.authorize(),
  (input, ctx) => ({
    image: ImageFactory.fromDataURL(input.image),
    text: new PostText(input.text),
    userId: new Id(ctx.session.userId),
  }),
  async ({ image, text, userId }) => {
    const friendshipRepository = new FriendshipRepository()

    const { friendships } = await friendshipRepository.getUserFollowers({
      followeeId: userId,
    })

    const fileService = new UploadFileService(
      new EnvRepository(),
      new FileRepository(),
      new ImageRepository(),
      new StorageRepository()
    )

    const { fileEntity } = await fileService.execute({ userId, image })

    const postRepository = new PostRepository()

    const { post } = await postRepository.createPost({
      friendships,
      text,
      userId,
      fileIds: fileEntity ? [fileEntity.id] : [],
    })

    return post
  }
)
