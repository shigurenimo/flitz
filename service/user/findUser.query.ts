import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"
import { toAppUserProfile } from "infrastructure/utils/toAppUserProfile"

type Props = {
  userId: Id
}

@injectable()
export class FindUserQuery {
  /**
   * ユーザを取得する
   * @param props
   */
  async execute(props: Props) {
    try {
      const user = await db.user.findUnique({
        where: { id: props.userId.value },
        include: {
          followers: props
            ? { where: { followerId: props.userId.value } }
            : false,
          headerImage: true,
          iconImage: true,
        },
      })

      if (user === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      return toAppUserProfile(user)
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
