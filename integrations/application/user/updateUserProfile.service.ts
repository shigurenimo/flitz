import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id, Name, ShortText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"

type Props = {
  headerImageId: Id | null
  iconImageId: Id | null
  userId: Id
  biography: ShortText
  name: Name
}

@injectable()
export class UpdateUserProfileService {
  constructor(private userRepository: UserRepository) {}

  /**
   * ユーザのプロフィールを更新する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user instanceof Error) {
        return new InternalError()
      }

      if (user === null) {
        captureException("データが見つからなかった。")

        return new NotFoundError()
      }

      const newUser = user
        .updateHeaderImage(props.headerImageId ?? null)
        .updateIconImage(props.iconImageId ?? null)
        .updateName(props.name)
        .updateBiography(props.biography)

      const transaction = await this.userRepository.upsert(newUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return newUser
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
