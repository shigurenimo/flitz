import { Ctx } from "blitz"
import {
  FileType,
  Id,
  Image,
  PostText,
  postTextSchema,
  Service,
} from "domain/valueObjects"
import {
  EnvRepository,
  FileRepository,
  FriendshipRepository,
  PostRepository,
  StorageRepository,
} from "infrastructure"
import { ImageRepository } from "infrastructure/imageRepository"
import * as z from "zod"

export const inputSchema = z.object({
  text: postTextSchema,
  image: z.string().nullable(), // base64 workaround. see onCreatePost in HomePageInput
})

const createPost = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  ctx.session.authorize()

  const { text, image } = inputSchema
    .transform((input) => ({
      text: new PostText(input.text),
      image: Image.fromDataURL(input.image),
    }))
    .parse(input)

  const userId = new Id(ctx.session.userId)

  const friendships = await FriendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  if (image === null) {
    const post = await PostRepository.createPost({
      friendships,
      text,
      userId,
      fileIds: [],
    })

    return post
  }

  const filePath = StorageRepository.createPath()

  await ImageRepository.writeImage(image, filePath)

  if (EnvRepository.isFirebaseProject()) {
    await StorageRepository.uploadToCloudStorage(filePath)
  }

  const file = await FileRepository.createFile({
    userId,
    fileType: new FileType("IMAGE_PNG"),
    service: new Service("CLOUD_STORAGE"),
    path: filePath,
  })

  const post = await PostRepository.createPost({
    friendships,
    text,
    userId,
    fileIds: [new Id(file.id)],
  })

  return post
}

export default createPost
