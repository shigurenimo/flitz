import { Injectable } from "@nestjs/common"
import { AuthenticationError, NotFoundError, SessionContext } from "blitz"
import {
  Email,
  Password,
  PasswordService,
  UserRepository,
  UserRole,
} from "integrations/domain"
import { SessionRepository } from "integrations/infrastructure"

@Injectable()
export class LoginService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private passwordService: PasswordService
  ) {}

  async call(input: {
    session: SessionContext
    password: Password
    email: Email
  }) {
    try {
      const userEntity = await this.userRepository.findByEmail(input.email)

      if (userEntity === null) {
        return new NotFoundError("ユーザーが存在しません")
      }

      const result = await this.passwordService.verifyPassword(
        userEntity.hashedPassword,
        input.password
      )

      if (this.passwordService.isInvalid(result)) {
        return new AuthenticationError()
      }

      // Upgrade hashed password with a more secure hash
      if (this.passwordService.needsRehash(result)) {
        const newHashPassword = await this.passwordService.hashPassword(
          input.password
        )
        await this.userRepository.upsert(
          userEntity.updateHashedPassword(newHashPassword)
        )
      }

      await this.sessionRepository.createSession(input.session, {
        name: userEntity.name,
        role: new UserRole("USER"),
        userId: userEntity.id,
        username: userEntity.username,
        iconImageId: userEntity.iconImageId || null,
      })

      return null
    } catch (error) {
      return Error()
    }
  }
}
