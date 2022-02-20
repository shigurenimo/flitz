import { captureException } from "@sentry/node"
import { AuthenticationError, NotFoundError, SecurePassword } from "blitz"
import { Email, HashedPassword, Password } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  password: Password
  email: Email
}

@injectable()
export class LoginService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.findByEmail(props.email)

      if (user === null) {
        return new NotFoundError("ユーザーが存在しません")
      }

      const result = await SecurePassword.verify(
        user.hashedPassword.value,
        props.password.value
      )

      if (
        result !== SecurePassword.VALID &&
        result !== SecurePassword.VALID_NEEDS_REHASH
      ) {
        return new AuthenticationError()
      }

      // Upgrade hashed password with a more secure hash
      if (result === SecurePassword.VALID_NEEDS_REHASH) {
        const improvedHash = await SecurePassword.hash(props.password.value)

        const newHashPassword = new HashedPassword(improvedHash)

        await this.userRepository.upsert(
          user.updateHashedPassword(newHashPassword)
        )
      }

      return user
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
