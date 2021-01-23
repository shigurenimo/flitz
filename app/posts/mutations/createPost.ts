import { Ctx } from "blitz"
import { ImageFactory } from "domain/factories"
import { Id, PostText, postTextSchema } from "domain/valueObjects"
import { FriendshipRepository, PostRepository } from "infrastructure"
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

  const friendships = await FriendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const file = image ? await FileService.uploadFile({ userId, image }) : null

  const post = await PostRepository.createPost({
    friendships,
    text,
    userId,
    fileIds: file ? [new Id(file.id)] : [],
  })

  return post
}

export default createPost
