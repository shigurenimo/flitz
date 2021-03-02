import { Injectable } from "@nestjs/common"
import {
  Id,
  IdFactory,
  MessageEntity,
  MessageRepository,
  PostText,
} from "integrations/domain"

@Injectable()
export class SendMessageService {
  constructor(private messageRepository: MessageRepository) {}

  async call(input: { text: PostText; userId: Id; relatedUserId: Id }) {
    try {
      const messageEntity = new MessageEntity({
        id: IdFactory.create(),
        text: input.text,
        isRead: false,
        userId: input.userId,
        relatedUserId: input.relatedUserId,
        createdAt: new Date(),
      })

      await this.messageRepository.upsert(messageEntity)
    } catch (error) {
      return Error()
    }
  }
}
