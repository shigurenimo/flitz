import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id, IdFactory, MessageEntity, PostText } from "core"
import { MessageRepository } from "infrastructure"
import { InternalError } from "integrations/errors"

type Props = {
  text: PostText
  userId: Id
  relatedUserId: Id
}

@injectable()
export class SendMessageService {
  constructor(private messageRepository: MessageRepository) {}

  async execute(props: Props) {
    try {
      const message = new MessageEntity({
        id: IdFactory.nanoid(),
        text: props.text,
        isRead: false,
        userId: props.userId,
        relatedUserId: props.relatedUserId,
        createdAt: new Date(),
      })

      const transaction = await this.messageRepository.upsert(message)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
