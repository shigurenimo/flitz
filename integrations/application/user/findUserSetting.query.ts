import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class FindUserSettingQuery {
  constructor(private queryConverter: QueryConverter) {}

  /**
   * @deprecated
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const setting = await db.setting.findUnique({
        where: { userId: props.userId.value },
      })

      if (setting === null) {
        return new NotFoundError()
      }

      return this.queryConverter.toSetting(setting)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
