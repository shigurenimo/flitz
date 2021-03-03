import { Injectable } from "@nestjs/common"
import { NotFoundError, SessionContext } from "blitz"
import { Biography, Id, Name, UserRepository } from "integrations/domain"
import { SessionRepository } from "integrations/infrastructure"

@Injectable()
export class UpdateUserProfileService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {}

  async call(input: {
    headerImageId?: Id
    iconImageId?: Id
    userId: Id
    biography: Biography
    name: Name
    session: SessionContext
  }) {
    try {
      const userEntity = await this.userRepository.find(input.userId)

      if (userEntity === null) {
        throw new NotFoundError()
      }

      const newUserEntity = userEntity.update({
        headerImageId: input.headerImageId,
        iconImageId: input.iconImageId,
        name: input.name,
        biography: input.biography,
      })

      await this.userRepository.upsert(newUserEntity)

      await this.sessionRepository.updatePublicData(input.session, {
        name: newUserEntity.name,
        username: newUserEntity.username,
        iconImageId: newUserEntity.iconImageId || null,
      })
    } catch (error) {
      return Error()
    }
  }
}
