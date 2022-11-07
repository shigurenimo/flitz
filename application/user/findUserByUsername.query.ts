import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import db from "db"
import { toAppUserProfile } from "infrastructure/utils/toAppUserProfile"
import { InternalError } from "integrations/errors"

type Props = {
  username: Username
  loginId: Id | null
}

@injectable()
export class FindUserByUsernameQuery {
  /**
   * ユーザ名からユーザを取得する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const user = await db.user.findUnique({
        where: { username: props.username.value },
        include: {
          followers: props.loginId
            ? { where: { followerId: props.loginId.value } }
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
