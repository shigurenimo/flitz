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
export class UpdateAccountEmailService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user === null) {
        throw new NotFoundError()
      }

      await this.userRepository.upsert(user.updateEmail(props.email))

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
