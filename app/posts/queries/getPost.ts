import { PostRepository } from "app/domain/repositories"
import { Id, idSchema } from "app/domain/valueObjects"
import { NotFoundError } from "blitz"
import * as z from "zod"

const inputSchema = z.object({ id: idSchema })

const getPost = async (input: z.infer<typeof inputSchema>) => {
  inputSchema.parse(input)

  const id = new Id(input.id)

  const post = await PostRepository.getPost({ id })

  if (!post) {
    throw new NotFoundError()
  }

  return post
}

export default getPost
