import type { Exchange, Message } from "db"
import type { ExchangeEntity } from "integrations/domain/entities"
import type { Id, PostText } from "integrations/domain/valueObjects"

/**
 * メッセージスレッド
 */
export interface IExchangeRepository {
  /**
   * スレッドのメッセージを作成する
   * @param input
   * @returns
   */
  createExchangeMessage(input: {
    text: PostText
    userId: Id
    exchangeId: Id
  }): Promise<{
    exchange: Exchange & {
      messages: Message[]
    }
    exchangeEntity: ExchangeEntity
  }>
}
