import db from "db"
import { Id, Username } from "integrations/domain"
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
      return null
    }

    return this.queryConverter.toProfile(user)
  }
}
