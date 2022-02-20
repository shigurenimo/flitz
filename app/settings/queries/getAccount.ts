import { resolver } from "blitz"
import { FindUserSimpleQuery } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const GetAccount = z.null()

const getAccount = resolver.pipe(
  resolver.zod(GetAccount),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const findUserQuery = container.resolve(FindUserSimpleQuery)

    const user = await findUserQuery.execute(props.userId)

    if (user === null) {
      throw new Error("")
    }

    return user
  }
)

export default getAccount
