import type { Exchange, Message, User } from "db"
import type { MessageEntity } from "domain/entities"
import type { Count, Id, PostText, Skip } from "domain/valueObjects"

/**
 * メッセージ
 */
export interface IMessageRepository {
  countUserGroupMessages(input: { exchangeId: Id }): Promise<Count>

  countUserMessages(input: { relatedUserId: Id; userId: Id }): Promise<Count>

  markMesagesAsRead(input: { relatedUserId: Id; userId: Id }): Promise<null>

  getUserExchangeMessages(input: {
    relatedUserId: Id
    skip: Skip
    userId: Id
  }): Promise<{
    messages: (Message & {
      user: User
      exchanges: Exchange[]
    })[]
    messageEntities: MessageEntity[]
  }>

  createMessage(input: {
    text: PostText
    userId: Id
    relatedUserId: Id
  }): Promise<null>
}
