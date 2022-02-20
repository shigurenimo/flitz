import { AuthenticationError, NotFoundError, SecurePassword } from "blitz"
import { HashedPassword, Id, Password } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  password: Password
  currentPassword: Password
}

@injectable()
export class UpdateAccountPasswordService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user === null) {
        throw new NotFoundError()
      }

      const result = await SecurePassword.verify(
        user.hashedPassword.value,
        props.currentPassword.value
      )

      if (
        result !== SecurePassword.VALID &&
        result !== SecurePassword.VALID_NEEDS_REHASH
      ) {
        return new AuthenticationError()
      }

      const improvedHash = await SecurePassword.hash(props.password.value)

      const newHashPassword = new HashedPassword(improvedHash)

      const newUser = user.updateHashedPassword(newHashPassword)

      await this.userRepository.upsert(newUser)

      return null
    } catch (error) {
      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
