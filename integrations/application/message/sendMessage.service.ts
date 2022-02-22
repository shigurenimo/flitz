import { captureException } from "@sentry/node"
import { Id, IdFactory, MessageEntity, PostText } from "integrations/domain"
import { InternalError } from "integrations/errors"
import { MessageRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

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

      await this.messageRepository.upsert(message)
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
