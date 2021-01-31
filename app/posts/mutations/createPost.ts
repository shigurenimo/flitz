import { Ctx } from "blitz"
import { ImageFactory } from "domain/factories"
import { Id, PostText, postTextSchema } from "domain/valueObjects"
import {
  FriendshipRepository,
  PostRepository,
} from "infrastructure/repositories"
import { FileService } from "services"
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
      image: ImageFactory.fromDataURL(input.image),
    }))
    .parse(input)

  const userId = new Id(ctx.session.userId)

  const friendshipRepository = new FriendshipRepository()

  const { friendships } = await friendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const fileService = new FileService()

  const { fileEntity } = await fileService.uploadFile({ userId, image })

  const postRepository = new PostRepository()

  const post = await postRepository.createPost({
    friendships,
    text,
    userId,
    fileIds: fileEntity ? [fileEntity.id] : [],
  })

  return post
}

export default createPost
