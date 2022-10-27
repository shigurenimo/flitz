import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Email, Id } from "core"
import { UserRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  userId: Id
  email: Email
}

@injectable()
export class UpdateUserEmailService {
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

      const draftUser = user.updateEmail(props.email)

      const transaction = await this.userRepository.upsert(draftUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
