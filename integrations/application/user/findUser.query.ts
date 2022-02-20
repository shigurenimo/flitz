import db from "db"
import { Id } from "integrations/domain"
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
      return null
    }

    return this.queryConverter.toProfile(user)
  }
}
