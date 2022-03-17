import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { Email, Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

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

      const newUser = user.updateEmail(props.email)

      const transaction = await this.userRepository.upsert(newUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
