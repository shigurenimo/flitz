import { PostRepository } from "domain/repositories"
import { Id, idSchema } from "domain/valueObjects"
import { Ctx } from "blitz"
import * as z from "zod"

const inputSchema = z.object({ postId: idSchema })

const deletePostLike = async (input: z.infer<typeof inputSchema>, ctx: Ctx) => {
  inputSchema.parse(input)

  ctx.session.authorize()

  const userId = new Id(ctx.session.userId)

  const postId = new Id(input.postId)

  const post = await PostRepository.deleteLikes({ postId, userId })

  return post
}

export default deletePostLike
