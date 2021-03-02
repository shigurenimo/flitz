import { Injectable } from "@nestjs/common"
import { AuthenticationError, NotFoundError } from "blitz"
import {
  Id,
  Password,
  PasswordService,
  UserRepository,
} from "integrations/domain"

@Injectable()
export class UpdateAccountPasswordService {
  constructor(
    private passwordService: PasswordService,
    private userRepository: UserRepository
  ) {}

  async call(input: {
    userId: Id
    password: Password
    currentPassword: Password
  }) {
    try {
      const userEntity = await this.userRepository.find(input.userId)

      if (userEntity === null) {
        throw new NotFoundError()
      }

      const result = await this.passwordService.verifyPassword(
        userEntity.hashedPassword,
        input.currentPassword
      )

      if (this.passwordService.isInvalid(result)) {
        return new AuthenticationError()
      }

      const newHashPassword = await this.passwordService.hashPassword(
        input.password
      )

      await this.userRepository.upsert(
        userEntity.updateHashedPassword(newHashPassword)
      )

      return null
    } catch (error) {
      return Error()
    }
  }
}
