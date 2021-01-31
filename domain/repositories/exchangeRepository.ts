import type { Exchange, File, Message, User } from "db"
import type { ExchangeEntity } from "domain/entities"
import type { Count, Id, PostText, Skip } from "domain/valueObjects"

/**
 * ## メッセージスレッド
 */
export interface IExchangeRepository {
  /**
   * ユーザーのスレッドを集計する
   * @param input
   * @returns
   */
  countUserExchanges(input: { userId: Id }): Promise<Count>

  /**
   * スレッドを取得する
   * @param input
   * @returns
   */
  getExchange(input: {
    exchangeId: Id
    skip: Skip
  }): Promise<{
    exchange:
      | (Exchange & {
          user: User & {
            iconImage: File | null
          }
          messages: Message[]
        })
      | null
    exchangeEntity: ExchangeEntity | null
  }>

  /**
   * ユーザーのスレッドを取得する
   * @param input
   * @returns
   */
  getUserExchange(input: {
    userId: Id
  }): Promise<{
    exchange: Exchange | null
    exchangeEntity: ExchangeEntity | null
  }>

  /**
   * ユーザーの複数のスレッドを取得する
   * @param input
   * @returns
   */
  getUserExchanges(input: {
    skip: Skip
    userId: Id
  }): Promise<{
    exchanges: (Exchange & {
      messages: (Message & {
        user: User
      })[]
      relatedUser: User | null
    })[]
    exchangeEntities: ExchangeEntity[]
  }>

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
