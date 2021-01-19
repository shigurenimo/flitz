import { Ctx } from "blitz"
import { Id, PostText, postTextSchema } from "domain/valueObjects"
import { FriendshipRepository, PostRepository } from "integrations"
import * as z from "zod"

export const inputSchema = z.object({ text: postTextSchema })

const createPost = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const text = new PostText(input.text)

  const userId = new Id(ctx.session.userId)

  const friendships = await FriendshipRepository.getUserFollowers({
    followeeId: userId,
  })

  const post = await PostRepository.createPost({ friendships, text, userId })

  return post
}

export default createPost
