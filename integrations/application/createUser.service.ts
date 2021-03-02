import { Injectable } from "@nestjs/common"
import { SessionContext } from "blitz"
import {
  Biography,
  Email,
  HashedPasswordFactory,
  IdFactory,
  Password,
  UserEntity,
  UserRepository,
  UserRole,
} from "integrations/domain"
import { SessionRepository } from "integrations/infrastructure"

@Injectable()
export class SignUpService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository
  ) {}

  async call(input: {
    session: SessionContext
    password: Password
    email: Email
  }) {
    try {
      const hashedPassword = await HashedPasswordFactory.fromPassword(
        input.password
      )

      const userId = IdFactory.create()

      const userEntity = new UserEntity({
        biography: new Biography(""),
        hashedPassword,
        headerImageId: null,
        iconImageId: null,
        id: userId,
        name: null,
        username: userId,
        email: input.email,
      })

      const upsertUser = await this.userRepository.upsert(userEntity)

      if (upsertUser instanceof Error) {
        return upsertUser
      }

      await this.sessionRepository.createSession(input.session, {
        name: userEntity.name,
        role: new UserRole("USER"),
        userId: userEntity.id,
        username: userEntity.username,
        iconImageId: null,
      })

      return null
    } catch (error) {
      return Error()
    }
  }
}
