import { AppPost } from "infrastructure/models/appPost"

/**
 * フォローしているユーザのポスト
 */
export type AppFolloweePost = AppPost & {
  /**
   * 既読済みかどうか
   */
  isRead: boolean
}
