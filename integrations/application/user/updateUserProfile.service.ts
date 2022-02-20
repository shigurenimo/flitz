import { captureException } from "@sentry/node"
import { NotFoundError, SessionContext } from "blitz"
import { Id, Name, ShortText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  headerImageId?: Id
  iconImageId?: Id
  userId: Id
  biography: ShortText
  name: Name
  session: SessionContext
}

@injectable()
export class UpdateUserProfileService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user === null) {
        throw new NotFoundError()
      }

      const newUser = user
        .updateHeaderImage(props.headerImageId ?? null)
        .updateIconImage(props.iconImageId ?? null)
        .updateName(props.name)
        .updateBiography(props.biography)

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
