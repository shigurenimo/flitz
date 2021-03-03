import { Injectable } from "@nestjs/common"
import { NotFoundError, SessionContext } from "blitz"
import { Id, Username, UserRepository } from "integrations/domain"
import { SessionRepository } from "integrations/infrastructure"

@Injectable()
export class UpdateUsernameService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {}

  async call(input: {
    session: SessionContext
    username: Username
    userId: Id
  }) {
    try {
      const userEntity = await this.userRepository.find(input.userId)

      if (userEntity === null) {
        throw new NotFoundError()
      }

      await this.userRepository.upsert(
        userEntity.updateUsername(input.username)
      )

      await this.sessionRepository.updatePublicData(input.session, {
        name: userEntity.name,
        username: userEntity.username,
        iconImageId: userEntity.iconImageId || null,
      })
    } catch (error) {
      return Error()
    }
  }
}
