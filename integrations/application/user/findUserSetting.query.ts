import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { QueryConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
}

@injectable()
export class FindUserSettingQuery {
  constructor(private queryConverter: QueryConverter) {}

  async find(props: Props) {
    const setting = await db.setting.findUnique({
      where: { userId: props.userId.value },
    })

    if (setting === null) return null

    return this.queryConverter.toSetting(setting)
  }
}
