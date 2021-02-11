import { NotFoundError, resolver } from "blitz"
import { Id, idSchema } from "integrations/domain"
import { PostRepository } from "integrations/infrastructure"
import * as z from "zod"

const GetPost = z.object({ id: idSchema })

export default resolver.pipe(
  resolver.zod(GetPost),
  (input) => ({
    id: new Id(input.id),
  }),
  async ({ id }) => {
    const postRepository = new PostRepository()

    const { post } = await postRepository.getPost({ id })

    if (!post) {
      throw new NotFoundError()
    }

    return post
  }
)
