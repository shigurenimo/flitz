import { NotFoundError } from "blitz"
import { Id, idSchema } from "domain/valueObjects"
import { PostRepository } from "infrastructure/repositories"
import * as z from "zod"

const inputSchema = z.object({ id: idSchema })

const getPost = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const id = new Id(input.id)

  const postRepository = new PostRepository()

  const { post } = await postRepository.getPost({ id })

  if (!post) {
    throw new NotFoundError()
  }

  return post
}

export default getPost
