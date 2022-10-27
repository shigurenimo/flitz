import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id, Username } from "core"
import { UserRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  username: Username
  userId: Id
}

@injectable()
export class UpdateUsernameService {
  constructor(private userRepository: UserRepository) {}

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

      const draftUser = user.updateUsername(props.username)

      const transaction = await this.userRepository.upsert(draftUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return draftUser
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
