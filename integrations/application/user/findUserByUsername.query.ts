import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id, Username } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  username: Username
  userId: Id | null
}

@injectable()
export class FindUserByUsernameQuery {
  constructor(private queryConverter: QueryConverter) {}

  /**
   * ユーザ名からユーザを取得する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const user = await db.user.findUnique({
        include: {
          followers: props.userId
            ? { where: { followerId: props.userId.value } }
            : false,
          headerImage: true,
          iconImage: true,
        },
        where: { username: props.username.value },
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
