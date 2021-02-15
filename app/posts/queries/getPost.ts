import { NotFoundError, resolver } from "blitz"
import { Id, idSchema } from "integrations/domain"
import { PostQuery } from "integrations/infrastructure/queries/postsQuery"
import * as z from "zod"

const GetPost = z.object({ id: idSchema })

export default resolver.pipe(
  resolver.zod(GetPost),
  (input) => ({
    id: new Id(input.id),
  }),
  async ({ id }) => {
    const postQuery = new PostQuery()

    const post = await postQuery.find({ id })

    if (!post) {
      throw new NotFoundError()
    }

    return post
  }
)
