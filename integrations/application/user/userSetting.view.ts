import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { ViewConverter } from "integrations/infrastructure/converters"
import { injectable } from "tsyringe"

@injectable()
export class UserSettingQuery {
  constructor(private queryConverter: ViewConverter) {}

  async has(input: { userId: Id }) {
    const setting = await db.setting.findUnique({
      where: { userId: input.userId.value },
    })

    return setting === null
  }

  async find(input: { userId: Id }) {
    const setting = await db.setting.findUnique({
      where: { userId: input.userId.value },
    })

    if (setting === null) return null

    return this.queryConverter.toSetting(setting)
  }
}
