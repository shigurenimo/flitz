import { Ctx } from "blitz"
import { FriendshipRepository, PostRepository } from "domain/repositories"
import { Id, Image, PostText, postTextSchema } from "domain/valueObjects"
import * as z from "zod"

export const inputSchema = z.object({
  text: postTextSchema,
  image: z.string().nullable(), // base64 workaround. see onCreatePost in HomePageInput
})

const createPost = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const text = new PostText(input.text)

  const userId = new Id(ctx.session.userId)

  const friendships = await FriendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const image = Image.fromDataURL(input.image)

  const post = await PostRepository.createPost({ friendships, text, userId })

  return post
}

export default createPost
