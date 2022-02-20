import { captureException } from "@sentry/node"
import { NotFoundError, SessionContext } from "blitz"
import { Id, Username } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  session: SessionContext
  username: Username
  userId: Id
}

@injectable()
export class UpdateUsernameService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user === null) {
        throw new NotFoundError()
      }

      const newUser = user.updateUsername(props.username)

      await this.userRepository.upsert(newUser)

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
