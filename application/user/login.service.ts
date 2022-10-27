import { SecurePassword } from "@blitzjs/auth"
import { captureException } from "@sentry/node"
import { AuthenticationError } from "blitz"
import { injectable } from "tsyringe"
import { Email, HashedPassword, Password } from "core"
import { InternalError } from "integrations/errors"
import { UserRepository } from "infrastructure"

type Props = {
  password: Password
  email: Email
}

@injectable()
export class LoginService {
  constructor(private userRepository: UserRepository) {}

  /**
   * ログインする
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const user = await this.userRepository.findByEmail(props.email)

      if (user instanceof Error) {
        return new InternalError()
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

      // パスワードを更新する
      if (result === SecurePassword.VALID_NEEDS_REHASH) {
        const improvedHash = await SecurePassword.hash(props.password.value)

        const newHashPassword = new HashedPassword(improvedHash)

        const newUser = user.updateHashedPassword(newHashPassword)

        await this.userRepository.upsert(newUser)
      }

      return user
    } catch (error) {
      captureException(error)

      // SecurePasswordを例外処理を発生させる
      if (error instanceof AuthenticationError) {
        return new AuthenticationError(
          "メールアドレスまたはパスワードが間違っています。"
        )
      }

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
