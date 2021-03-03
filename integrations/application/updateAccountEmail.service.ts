import { Injectable } from "@nestjs/common"
import { NotFoundError } from "blitz"
import { Email, Id, UserRepository } from "integrations/domain"

@Injectable()
export class UpdateAccountEmailService {
  constructor(private userRepository: UserRepository) {}

  async call(input: { userId: Id; email: Email }) {
    try {
      const userEntity = await this.userRepository.find(input.userId)

      if (userEntity === null) {
        throw new NotFoundError()
      }

      await this.userRepository.upsert(userEntity.updateEmail(input.email))

      return null
    } catch (error) {
      return Error()
    }
  }
}
