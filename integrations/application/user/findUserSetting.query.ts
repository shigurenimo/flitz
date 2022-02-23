import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { AppSetting } from "integrations/interface/types"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class FindUserSettingQuery {
  /**
   * @deprecated
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const prismaSetting = await db.setting.findUnique({
        where: { userId: props.userId.value },
      })

      if (prismaSetting === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      const setting: AppSetting = {
        ...prismaSetting,
        fcmToken: prismaSetting.fcmToken?.slice(0, 4) || null,
        fcmTokenForMobile: prismaSetting.fcmTokenForMobile?.slice(0, 4) || null,
      }

      return setting
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
