import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class FindUserQuery {
  constructor(private queryConverter: QueryConverter) {}

  /**
   * ユーザを取得する
   * @param props
   */
  async execute(props: Props) {
    try {
      const user = await db.user.findUnique({
        include: {
          followers: props
            ? { where: { followerId: props.userId.value } }
            : false,
          headerImage: true,
          iconImage: true,
        },
        where: { id: props.userId.value },
      })

      if (user === null) {
        return new NotFoundError()
      }

      return this.queryConverter.toProfile(user)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
