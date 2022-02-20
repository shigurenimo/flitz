import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { Id } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { LikeRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  userId: Id
  postId: Id
}

@injectable()
export class DeletePostLikeService {
  constructor(private likeRepository: LikeRepository) {}

  async execute(props: Props) {
    try {
      const like = await this.likeRepository.find(props.userId, props.postId)

      if (like === null) {
        throw new NotFoundError()
      }

      await this.likeRepository.delete(like)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
